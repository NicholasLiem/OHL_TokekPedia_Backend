import { Express } from 'express';
import { DataSource } from 'typeorm';
import { BarangController } from './controller/barang.controller';
import { PerusahaanController } from './controller/perusahaan.controller';
import { SessionController } from './controller/session.controller';
import { register } from './controller/user.controller';
import { requireUser } from './middlewares/requireUser.middleware';

function routes(app: Express, db: DataSource) {
  const barangController = new BarangController(db);
  const perusahaanController = new PerusahaanController(db);
  const sessionController = new SessionController(db);

  // Login and Session
  app.post('/register', requireUser, (req, res) => {
    register(req, res, db);
  });

  app.get('/self', requireUser, (req, res) => {
    sessionController.getSessionHandler(req, res);
  });

  app.post('/logout', requireUser, (req, res) => {
    sessionController.deleteSessionHandler(req, res);
  });

  app.get('/session', requireUser, (req, res) => {
    sessionController.getSessionHandler(req, res);
  });

  app.delete('/session', requireUser, (req, res) => {
    sessionController.deleteSessionHandler(req, res);
  });

  app.post('/login', (req, res) => {
    sessionController.createSessionHandler(req, res);
  });

  // Route for managing barang
  app.post('/barang', requireUser, (req, res) => {
    barangController.createBarang(req, res);
  });

  app.get('/barang', requireUser, (req, res) => {
    barangController.searchBarang(req, res);
  });

  app.get('/barang/:id', requireUser, (req, res) => {
    barangController.getBarang(req, res);
  });

  app.put('/barang/:id', requireUser, (req, res) => {
    barangController.updateBarang(req, res);
  });

  app.delete('/barang/:id', requireUser, (req, res) => {
    barangController.deleteBarangById(req, res);
  });

  // Route for managing perusahaan
  app.post('/perusahaan', requireUser, (req, res) => {
    perusahaanController.createPerusahaan(req, res);
  });

  app.get('/perusahaan', requireUser, (req, res) => {
    perusahaanController.searchPerusahaan(req, res);
  });

  app.get('/perusahaan/:id', requireUser, (req, res) => {
    perusahaanController.getPerusahaanById(req, res);
  });

  app.put('/perusahaan/:id', requireUser, (req, res) => {
    perusahaanController.updatePerusahaan(req, res);
  });

  app.delete('/perusahaan/:id', requireUser, (req, res) => {
    perusahaanController.deletePerusahaanById(req, res);
  });

  /* Nonexisting Route handling */
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Cannot access route' });
  });
}

export default routes;
