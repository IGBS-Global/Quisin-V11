import Fastify from 'fastify';
import cors from '@fastify/cors';
import postgres from '@fastify/postgres';
import { nanoid } from 'nanoid';

const fastify = Fastify({ logger: true });

// Enable CORS
await fastify.register(cors, {
  origin: true
});

// Register PostgreSQL
await fastify.register(postgres, {
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/quisin'
});

// Initialize database tables
fastify.ready().then(async () => {
  try {
    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL NOT NULL,
        currency TEXT NOT NULL,
        category TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        image TEXT,
        ingredients JSONB,
        allergens JSONB,
        condiments JSONB,
        available BOOLEAN DEFAULT true,
        preparation_time TEXT,
        calories INTEGER,
        spicy_level INTEGER,
        is_vegetarian BOOLEAN,
        is_vegan BOOLEAN,
        is_gluten_free BOOLEAN
      );

      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        shift_start TEXT,
        shift_end TEXT,
        shift_days JSONB,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tables (
        id TEXT PRIMARY KEY,
        number TEXT NOT NULL,
        seats INTEGER NOT NULL,
        location TEXT,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        table_id TEXT NOT NULL,
        items JSONB NOT NULL,
        status TEXT NOT NULL,
        total DECIMAL NOT NULL,
        tax DECIMAL NOT NULL,
        subtotal DECIMAL NOT NULL,
        waiter_id TEXT NOT NULL,
        waiter_name TEXT NOT NULL,
        estimated_time TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    fastify.log.error('Database initialization error:', err);
    process.exit(1);
  }
});

// Menu Items Routes
fastify.get('/api/menu', async (request, reply) => {
  const { rows } = await fastify.pg.query('SELECT * FROM menu_items');
  return rows.map(item => ({
    ...item,
    price: parseFloat(item.price),
    ingredients: item.ingredients || [],
    allergens: item.allergens || [],
    condiments: item.condiments || []
  }));
});

fastify.post('/api/menu', async (request, reply) => {
  const item = request.body;
  const { rows } = await fastify.pg.query(
    `INSERT INTO menu_items (
      name, description, price, currency, category, meal_type,
      image, ingredients, allergens, condiments, available,
      preparation_time, calories, spicy_level, is_vegetarian,
      is_vegan, is_gluten_free
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    RETURNING id`,
    [
      item.name,
      item.description,
      item.price,
      item.currency,
      item.category,
      item.mealType,
      item.image,
      JSON.stringify(item.ingredients),
      JSON.stringify(item.allergens),
      JSON.stringify(item.condiments),
      item.available,
      item.preparationTime,
      item.calories,
      item.spicyLevel,
      item.isVegetarian,
      item.isVegan,
      item.isGlutenFree
    ]
  );

  reply.code(201).send({ id: rows[0].id });
});

// Staff Routes
fastify.get('/api/staff', async () => {
  const { rows } = await fastify.pg.query('SELECT * FROM staff');
  return rows.map(s => ({
    ...s,
    shift: {
      start: s.shift_start,
      end: s.shift_end,
      days: s.shift_days
    }
  }));
});

fastify.post('/api/staff', async (request, reply) => {
  const staff = request.body;
  const id = nanoid();
  await fastify.pg.query(
    `INSERT INTO staff (
      id, name, email, phone, shift_start, shift_end,
      shift_days, username, password, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      staff.name,
      staff.email,
      staff.phone,
      staff.shift.start,
      staff.shift.end,
      JSON.stringify(staff.shift.days),
      staff.username,
      staff.password,
      staff.status
    ]
  );

  reply.code(201).send({ id });
});

// Tables Routes
fastify.get('/api/tables', async () => {
  const { rows } = await fastify.pg.query('SELECT * FROM tables');
  return rows;
});

fastify.post('/api/tables', async (request, reply) => {
  const table = request.body;
  const id = nanoid();
  await fastify.pg.query(
    `INSERT INTO tables (id, number, seats, location, status)
    VALUES ($1, $2, $3, $4, $5)`,
    [id, table.number, table.seats, table.location, table.status]
  );

  reply.code(201).send({ id });
});

// Orders Routes
fastify.get('/api/orders', async () => {
  const { rows } = await fastify.pg.query('SELECT * FROM orders');
  return rows.map(order => ({
    ...order,
    items: order.items,
    total: parseFloat(order.total),
    tax: parseFloat(order.tax),
    subtotal: parseFloat(order.subtotal)
  }));
});

fastify.post('/api/orders', async (request, reply) => {
  const order = request.body;
  const id = nanoid();
  await fastify.pg.query(
    `INSERT INTO orders (
      id, table_id, items, status, total, tax,
      subtotal, waiter_id, waiter_name, estimated_time
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      order.tableId,
      JSON.stringify(order.items),
      order.status,
      order.total,
      order.tax,
      order.subtotal,
      order.waiterId,
      order.waiterName,
      order.estimatedTime
    ]
  );

  reply.code(201).send({ id });
});

// Authentication Route
fastify.post('/api/auth/login', async (request, reply) => {
  const { username, password } = request.body;
  
  if (username === 'admin' && password === 'admin123') {
    return { id: 'admin', name: 'Admin', role: 'admin' };
  }

  const { rows } = await fastify.pg.query(
    'SELECT * FROM staff WHERE username = $1 AND password = $2 AND status = $3',
    [username, password, 'active']
  );

  if (rows.length > 0) {
    const staff = rows[0];
    return { id: staff.id, name: staff.name, role: 'waiter' };
  }

  reply.code(401).send({ error: 'Invalid credentials' });
});

// Start server
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}