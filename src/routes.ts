import { Express } from 'express';
import { DataSource } from 'typeorm';
import { BarangController } from './controller/barang.controller';
import { PerusahaanController } from './controller/perusahaan.controller';
import { register, login } from './controller/user.controller';

function routes(app: Express, db: DataSource) {
  const barangController = new BarangController(db);
  const perusahaanController = new PerusahaanController(db);

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
    barangController.createBarang(req, res);
  });

  app.get('/barang', (req, res) => {
    barangController.searchBarang(req, res);
  });

  app.get('/barang/:id', (req, res) => {
    barangController.getBarang(req, res);
  });

  app.put('/barang/:id', (req, res) => {
    barangController.updateBarang(req, res);
  });

  app.delete('/barang/:id', (req, res) => {
    barangController.deleteBarangById(req, res);
  });

  // Route for managing perusahaan
  app.post('/perusahaan', (req, res) => {
    perusahaanController.createPerusahaan(req, res);
  });

  app.get('/perusahaan', (req, res) => {
    perusahaanController.searchPerusahaan(req, res);
  });

  app.get('/perusahaan/:id', (req, res) => {
    perusahaanController.getPerusahaanById(req, res);
  });

  app.put('/perusahaan/:id', (req, res) => {
    perusahaanController.updatePerusahaan(req, res);
  });

  app.delete('/perusahaan/:id', (req, res) => {
    perusahaanController.deletePerusahaanById(req, res);
  });

  /* Nonexisting Route handling */
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Cannot access route' });
  });
}

export default routes;
