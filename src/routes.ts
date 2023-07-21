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
  /**
   * @openapi
   * '/self':
   *  get:
   *    tags: 
   *      - Auth
   *    description: Get current info of auth
   *    security:
   *      - BearerAuth: []
   *    responses:
   *      200:
   *        description: Success
   *      401:
   *        description: Has to have auth bearer token (via /login) to access this route
   */
  app.get('/self', checkToken, (req, res) => {
    sessionController.getSessionHandler(req, res);
  });

  /**
   * @openapi
   * '/login':
   *  post:
   *    tags: 
   *      - Auth
   *    description: Logging in user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/LoginRequest'
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LoginResponse'
   *      401:
   *        description: Has to have auth bearer token (via /login) to access this route
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InvalidCredentialsResponse'
   */
  app.post('/login', (req, res) => {
    sessionController.createSessionHandler(req, res);
  });

  // Route for managing barang
  /**
   * @openapi
   * '/barang':
   *  post:
   *    tags: 
   *      - Barang
   *    description: Adding barang to the database
   *    security:
   *      - BearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateBarangRequest'
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SuccessBarangResponse'
   *      401:
   *        description: Token Error / No Token
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InvalidTokenResponse'
   */
  app.post('/barang', checkToken, (req, res) => {
    barangController.createBarang(req, res);
  });


  /**
   * @openapi
   * '/barang':
   *  get:
   *    tags: 
   *      - Barang
   *    description: Get all barang
   */
  app.get('/barang', (req, res) => {
    barangController.searchBarang(req, res);
  });

  /**
   * @openapi
   * '/barang/{id}':
   *  get:
   *    tags: 
   *      - Barang
   *    description: Get all barang
   *    parameters:
   *      - name: id
   *        in: path
   *        description: barang id
   *        required: true
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SuccessBarangResponse'
   */
  app.get('/barang/:id', (req, res) => {
    barangController.getBarang(req, res);
  });

  /**
   * Belom
   */
  app.put('/barang/:id', checkToken, (req, res) => {
    barangController.updateBarang(req, res);
  });

  /**
   * Belom
   */
  app.delete('/barang/:id', checkToken, (req, res) => {
    barangController.deleteBarangById(req, res);
  });

  // Route for managing perusahaan
  /**
   * Belom
   */
  app.post('/perusahaan', checkToken, (req, res) => {
    perusahaanController.createPerusahaan(req, res);
  });

    /**
   * @openapi
   * '/perusahaan':
   *  get:
   *    tags: 
   *      - Perusahaan
   *    description: Get all perusahaan
   *    responses:
   *      200:
   *        description: Success
   */
  app.get('/perusahaan', (req, res) => {
    perusahaanController.searchPerusahaan(req, res);
  });

    /**
   * @openapi
   * '/perusahaan/{id}':
   *  get:
   *    tags: 
   *      - Perusahaan
   *    description: Get perusahaan detail by id
   *    parameters:
   *      - name: id
   *        in: path
   *        description: perusahaan id
   *        required: true
   *    responses:
   *      200:
   *        description: Success
   *      404:
   *        description: Error
   */
  app.get('/perusahaan/:id', (req, res) => {
    perusahaanController.getPerusahaanById(req, res);
  });

  /**
   * Belom
   */
  app.put('/perusahaan/:id', checkToken, (req, res) => {
    perusahaanController.updatePerusahaan(req, res);
  });

  /**
   * Belom
   */
  app.delete('/perusahaan/:id', checkToken, (req, res) => {
    perusahaanController.deletePerusahaanById(req, res);
  });

  /* Nonexisting Route handling */
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Cannot access route' });
  });
}

export default routes;
