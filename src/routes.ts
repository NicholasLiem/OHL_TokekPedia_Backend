import { Express } from 'express';
import { DataSource } from 'typeorm';
import { createBarang, getBarang, updateBarang, deleteBarangById } from './controller/barang.controller';
import { createPerusahaan } from './controller/perusahaan.controller';

function routes(app: Express, db: DataSource) {
  app.get('/self', (req, res) => {
    res.sendStatus(200);
  });

  // Route for login

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

  /* Nonexisting Route handling */
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Cannot access route' });
  });
}

export default routes;
