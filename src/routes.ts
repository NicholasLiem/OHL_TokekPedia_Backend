import { Express } from 'express';
import { DataSource } from 'typeorm';
import { createBarang, getBarang, updateBarang, deleteBarangById } from './controller/barang.controller';
import { createPerusahaan, getPerusahaanById, updatePerusahaan, deletePerusahaanById } from './controller/perusahaan.controller';
import { register, login } from './controller/user.controller';

function routes(app: Express, db: DataSource) {
  app.get('/self', (req, res) => {
    res.sendStatus(200);
  });

  // Route for login
  app.post('/register', (req, res) => {
    register(req, res, db);
  });

  app.post('/login', (req, res) => {
    login(req, res, db);
  });

  // Route for managing barang
  app.post('/barang', (req, res) => {
    createBarang(req, res, db);
  });

  app.get('/barang/:id', (req, res) => {
    getBarang(req, res, db);
  });

  app.put('/barang/:id', (req, res) => {
    updateBarang(req, res, db);
  });

  app.get('/barang/', (req, res) => {
    // getBarangByQuery(req, res, db);
  });

  app.delete('/barang/:id', (req, res) => {
    deleteBarangById(req, res, db);
  });



  // Route for managing perusahaan
  app.post('/perusahaan', (req, res) => {
    createPerusahaan(req, res, db);
  });

  app.get('/perusahaan/:id', (req, res) => {
    getPerusahaanById(req, res, db);
  });

  app.put('/perusahaan/:id', (req, res) => {
    updatePerusahaan(req, res, db);
  });

  app.delete('/perusahaan/:id', (req, res) => {
    deletePerusahaanById(req, res, db);
  });

  /* Nonexisting Route handling */
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Cannot access route' });
  });
}

export default routes;
