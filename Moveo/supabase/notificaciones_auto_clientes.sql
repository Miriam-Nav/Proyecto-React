-- NOTIFICACIONES AUTOMÁTICAS AL CREAR CLIENTES


-- Habilitar extensión pg_net (para hacer HTTP requests desde PostgreSQL)
create extension if not exists pg_net;

-- Función que envía notificaciones push a todos los dispositivos
create or replace function notify_new_cliente()
returns trigger
language plpgsql
security definer
as $$
declare
  v_token record;
  v_payload jsonb;
  v_response_id bigint;
  v_cliente_nombre text;
begin
  -- Asegurar que se tiene el nombre del cliente (usar COALESCE por seguridad)
  v_cliente_nombre := COALESCE(NEW.nombre, 'Nuevo cliente');
  
  -- Log de inicio
  raise notice 'Trigger activado para cliente: %', v_cliente_nombre;
  
  -- Construir el payload para cada token
  for v_token in 
    select token from push_tokens
  loop
    -- Crear el mensaje de notificación
    v_payload := jsonb_build_object(
      'to', v_token.token,
      'title', 'Nuevo Cliente Registrado',
      'body', 'Se ha creado el cliente: ' || v_cliente_nombre,
      'sound', 'default',
      'data', jsonb_build_object(
        'type', 'new_cliente',
        'cliente_id', NEW.id,
        'cliente_nombre', v_cliente_nombre
      )
    );

    -- Enviar request HTTP a la API de Expo Push
    begin
      select into v_response_id net.http_post(
        url := 'https://exp.host/--/api/v2/push/send',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Accept', 'application/json'
        ),
        body := v_payload
      );
      
      -- Log de éxito
      raise notice 'Notificación enviada a token: % (response_id: %)', v_token.token, v_response_id;
    exception when others then
      -- No fallar el INSERT si la notificación falla
      raise warning 'Error enviando notificación a token %: %', v_token.token, SQLERRM;
    end;
  end loop;

  return NEW;
end;
$$;

-- Crear el trigger que se ejecuta DESPUÉS de insertar un cliente
drop trigger if exists trigger_notify_new_cliente on clientes;

create trigger trigger_notify_new_cliente
  after insert on clientes
  for each row
  execute function notify_new_cliente();

