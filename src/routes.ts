import { Express } from 'express';
import { DataSource } from 'typeorm';
import { BarangController } from './controller/barang.controller';
import { PerusahaanController } from './controller/perusahaan.controller';
import { SessionController } from './controller/session.controller';
import { checkToken } from './middlewares/checkToken.middleware';

function routes(app: Express, db: DataSource) {
  const barangController = new BarangController(db);
  const perusahaanController = new PerusahaanController(db);
  const sessionController = new SessionController(db);

  // Login and Session
  app.get('/self', checkToken, (req, res) => {
    sessionController.getSessionHandler(req, res);
  });

  app.post('/login', (req, res) => {
    sessionController.createSessionHandler(req, res);
  });

  // Route for managing barang
  app.post('/barang', checkToken, (req, res) => {
    barangController.createBarang(req, res);
  });

  app.get('/barang', (req, res) => {
    barangController.searchBarang(req, res);
  });

  app.get('/barang/:id', (req, res) => {
    barangController.getBarang(req, res);
  });

  app.put('/barang/:id', checkToken, (req, res) => {
    barangController.updateBarang(req, res);
  });

  app.delete('/barang/:id', checkToken, (req, res) => {
    barangController.deleteBarangById(req, res);
  });

  // Route for managing perusahaan
  app.post('/perusahaan', checkToken, (req, res) => {
    perusahaanController.createPerusahaan(req, res);
  });

  app.get('/perusahaan', (req, res) => {
    perusahaanController.searchPerusahaan(req, res);
  });

  app.get('/perusahaan/:id', (req, res) => {
    perusahaanController.getPerusahaanById(req, res);
  });

  app.put('/perusahaan/:id', checkToken, (req, res) => {
    perusahaanController.updatePerusahaan(req, res);
  });

  app.delete('/perusahaan/:id', checkToken, (req, res) => {
    perusahaanController.deletePerusahaanById(req, res);
  });

  /* Nonexisting Route handling */
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Cannot access route' });
  });
}

export default routes;
