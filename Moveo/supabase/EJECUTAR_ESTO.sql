-- ========================================
-- SCRIPT PARA HABILITAR REALTIME Y AGREGAR DATOS DE EJEMPLO
-- ========================================
-- 
-- Este script NO modifica las tablas existentes.
-- Solo agrega datos de ejemplo y habilita Realtime.
--
-- INSTRUCCIONES:
-- 1. Ve a Supabase Dashboard → SQL Editor
-- 2. Copia y pega este script completo
-- 3. Haz clic en "Run"
-- 4. ¡Listo!
--
-- ========================================

-- ========================================
-- PASO 1: AGREGAR VIDEOJUEGOS DE EJEMPLO
-- ========================================
-- Solo si la tabla está vacía

INSERT INTO videojuegos (titulo, plataforma, genero, precio_alquiler_dia, stock)
SELECT * FROM (
    VALUES
        ('The Legend of Zelda: Breath of the Wild', 'Nintendo Switch', 'Aventura', 5.00, 3),
        ('God of War Ragnarök', 'PlayStation 5', 'Acción', 7.00, 2),
        ('Elden Ring', 'PC', 'RPG', 6.00, 4),
        ('FIFA 24', 'PlayStation 5', 'Deportes', 4.50, 5),
        ('Super Mario Odyssey', 'Nintendo Switch', 'Plataformas', 5.00, 3),
        ('Hogwarts Legacy', 'PC', 'Acción-Aventura', 6.50, 2),
        ('Mario Kart 8 Deluxe', 'Nintendo Switch', 'Carreras', 4.00, 4),
        ('Spider-Man 2', 'PlayStation 5', 'Acción', 7.50, 2)
) AS v(titulo, plataforma, genero, precio_alquiler_dia, stock)
WHERE NOT EXISTS (SELECT 1 FROM videojuegos LIMIT 1);

-- ========================================
-- PASO 2: HABILITAR REALTIME PARA ALQUILERES
-- ========================================
-- Esto permite que los cambios se vean en tiempo real

ALTER PUBLICATION supabase_realtime ADD TABLE alquileres;

-- ========================================
-- PASO 3: VERIFICAR POLÍTICAS RLS (Opcional)
-- ========================================
-- Si tus tablas no tienen políticas RLS, las crea

-- Videojuegos: todos los autenticados pueden leer
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'videojuegos' 
        AND policyname = 'Usuarios autenticados pueden ver videojuegos'
    ) THEN
        ALTER TABLE videojuegos ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Usuarios autenticados pueden ver videojuegos"
        ON videojuegos FOR SELECT
        TO authenticated
        USING (true);
        
        CREATE POLICY "Usuarios autenticados pueden modificar videojuegos"
        ON videojuegos FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Alquileres: todos los autenticados pueden leer/escribir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'alquileres' 
        AND policyname = 'Usuarios autenticados pueden ver alquileres'
    ) THEN
        ALTER TABLE alquileres ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Usuarios autenticados pueden ver alquileres"
        ON alquileres FOR SELECT
        TO authenticated
        USING (true);
        
        CREATE POLICY "Usuarios autenticados pueden modificar alquileres"
        ON alquileres FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- ========================================
-- ✅ SCRIPT COMPLETADO
-- ========================================
-- 
-- Ahora puedes:
-- 1. Ir a Database → Replication
-- 2. Verificar que "alquileres" está habilitado
-- 3. Ejecutar tu app: npx expo start
-- 4. Probar el tiempo real creando alquileres
--
-- ========================================
