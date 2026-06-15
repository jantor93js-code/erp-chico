# Cliente

Campos:

- id
- nombre
- nit
- dirección
- teléfono
- email
- estado

# Pedido

Campos:

- id
- cliente
- fecha
- origen
- destino
- tipo_servicio
- estado

# Servicio

Campos:

- id
- pedido
- vehículo
- conductor
- fecha_programada
- estado

# Legalización

Campos:

- id
- servicio
- gastos
- soportes
- estado

# Factura

Campos:

- id
- cliente
- servicio
- valor
- fecha
- estado