-- FUNCION: Validar stock disponible antes de crear alquiler
CREATE OR REPLACE FUNCTION validar_stock_disponible()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_stock_actual INTEGER;
  v_titulo_videojuego TEXT;
  v_debe_validar BOOLEAN := FALSE;
BEGIN
  -- Determinar si debemos validar el stock
  IF TG_OP = 'INSERT' THEN
    -- En INSERT, validar solo si el estado es 'activo'
    v_debe_validar := (NEW.estado = 'activo');
  ELSIF TG_OP = 'UPDATE' THEN
    -- En UPDATE, validar solo si se está REACTIVANDO (de finalizado/cancelado a activo)
    v_debe_validar := ((OLD.estado = 'finalizado' OR OLD.estado = 'cancelado') AND NEW.estado = 'activo');
  END IF;

  -- Si no es necesario validar, retornar directamente
  IF NOT v_debe_validar THEN
    RETURN NEW;
  END IF;

  -- Obtener stock actual y título del videojuego
  SELECT stock, titulo 
  INTO v_stock_actual, v_titulo_videojuego
  FROM videojuegos 
  WHERE id = NEW.videojuego_id;

  -- Verificar que el videojuego existe
  IF NOT FOUND THEN
    RAISE EXCEPTION 'El videojuego con ID % no existe', NEW.videojuego_id;
  END IF;

  -- Validar que hay stock disponible
  IF v_stock_actual <= 0 THEN
    RAISE EXCEPTION 'No hay stock disponible para el videojuego "%". Stock actual: %', 
      v_titulo_videojuego, v_stock_actual;
  END IF;
  
  RAISE NOTICE 'Stock validado para "%": % unidad(es) disponible(s)', 
    v_titulo_videojuego, v_stock_actual;

  RETURN NEW;
END;
$$;


-- FUNCIÓN: Reducir stock al crear alquiler activo
CREATE OR REPLACE FUNCTION reducir_stock_alquiler()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_titulo_videojuego TEXT;
BEGIN
  -- Solo reducir stock si el estado es 'activo'
  IF NEW.estado = 'activo' THEN
    -- Reducir el stock en 1
    UPDATE videojuegos
    SET stock = stock - 1
    WHERE id = NEW.videojuego_id
    RETURNING titulo INTO v_titulo_videojuego;

    RAISE NOTICE 'Stock reducido para alquiler ID %: videojuego "%"', 
      NEW.id, v_titulo_videojuego;
  END IF;

  RETURN NEW;
END;
$$;


-- FUNCIÓN: Devolver stock al finalizar/cancelar alquiler Y restar al reactivar
CREATE OR REPLACE FUNCTION devolver_stock_alquiler()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_titulo_videojuego TEXT;
BEGIN
  -- Detectar cambio de estado de 'activo' a 'finalizado' o 'cancelado'
  IF OLD.estado = 'activo' AND (NEW.estado = 'finalizado' OR NEW.estado = 'cancelado') THEN
    
    -- Devolver el stock (incrementar en 1)
    UPDATE videojuegos
    SET stock = stock + 1
    WHERE id = NEW.videojuego_id
    RETURNING titulo INTO v_titulo_videojuego;

    RAISE NOTICE 'Stock devuelto para alquiler ID %: videojuego "%" (estado: % → %)', 
      NEW.id, v_titulo_videojuego, OLD.estado, NEW.estado;
  
  -- Detectar reactivación: de 'finalizado' o 'cancelado' a 'activo'
  ELSIF (OLD.estado = 'finalizado' OR OLD.estado = 'cancelado') AND NEW.estado = 'activo' THEN
    
    -- Reducir el stock nuevamente (restar 1)
    UPDATE videojuegos
    SET stock = stock - 1
    WHERE id = NEW.videojuego_id
    RETURNING titulo INTO v_titulo_videojuego;

    RAISE NOTICE 'Stock reducido al reactivar alquiler ID %: videojuego "%" (estado: % → %)', 
      NEW.id, v_titulo_videojuego, OLD.estado, NEW.estado;
  END IF;

  RETURN NEW;
END;
$$;


-- FUNCIÓN: Devolver stock al eliminar alquiler activo
CREATE OR REPLACE FUNCTION devolver_stock_al_eliminar()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_titulo_videojuego TEXT;
BEGIN
  -- Si el alquiler eliminado estaba activo, devolver el stock
  IF OLD.estado = 'activo' THEN
    UPDATE videojuegos
    SET stock = stock + 1
    WHERE id = OLD.videojuego_id
    RETURNING titulo INTO v_titulo_videojuego;

    RAISE NOTICE 'Stock devuelto al eliminar alquiler ID %: videojuego "%"', 
      OLD.id, v_titulo_videojuego;
  END IF;

  RETURN OLD;
END;
$$;

-- TRIGGERS - Crear o Reemplazar
-- Trigger 1: Validar stock ANTES de insertar
DROP TRIGGER IF EXISTS trigger_validar_stock ON alquileres;
CREATE TRIGGER trigger_validar_stock
  BEFORE INSERT ON alquileres
  FOR EACH ROW
  EXECUTE FUNCTION validar_stock_disponible();

-- Trigger 1b: Validar stock ANTES de actualizar (para reactivaciones)
DROP TRIGGER IF EXISTS trigger_validar_stock_update ON alquileres;
CREATE TRIGGER trigger_validar_stock_update
  BEFORE UPDATE ON alquileres
  FOR EACH ROW
  EXECUTE FUNCTION validar_stock_disponible();

-- Trigger 2: Reducir stock DESPUÉS de insertar alquiler activo
DROP TRIGGER IF EXISTS trigger_reducir_stock ON alquileres;
CREATE TRIGGER trigger_reducir_stock
  AFTER INSERT ON alquileres
  FOR EACH ROW
  EXECUTE FUNCTION reducir_stock_alquiler();

-- Trigger 3: Devolver/Reducir stock DESPUÉS de cambiar estado
DROP TRIGGER IF EXISTS trigger_devolver_stock ON alquileres;
CREATE TRIGGER trigger_devolver_stock
  AFTER UPDATE ON alquileres
  FOR EACH ROW
  EXECUTE FUNCTION devolver_stock_alquiler();

-- Trigger 4: Devolver stock ANTES de eliminar alquiler activo
DROP TRIGGER IF EXISTS trigger_devolver_stock_eliminar ON alquileres;
CREATE TRIGGER trigger_devolver_stock_eliminar
  BEFORE DELETE ON alquileres
  FOR EACH ROW
  EXECUTE FUNCTION devolver_stock_al_eliminar();


