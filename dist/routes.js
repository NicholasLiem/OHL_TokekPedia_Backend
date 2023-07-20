"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const barang_controller_1 = require("./controller/barang.controller");
const perusahaan_controller_1 = require("./controller/perusahaan.controller");
const session_controller_1 = require("./controller/session.controller");
const checkToken_middleware_1 = require("./middlewares/checkToken.middleware");
function routes(app, db) {
    const barangController = new barang_controller_1.BarangController(db);
    const perusahaanController = new perusahaan_controller_1.PerusahaanController(db);
    const sessionController = new session_controller_1.SessionController(db);
    // Login and Session
    app.get('/self', checkToken_middleware_1.checkToken, (req, res) => {
        sessionController.getSessionHandler(req, res);
    });
    app.post('/login', (req, res) => {
        sessionController.createSessionHandler(req, res);
    });
    // Route for managing barang
    app.post('/barang', checkToken_middleware_1.checkToken, (req, res) => {
        barangController.createBarang(req, res);
    });
    app.get('/barang', (req, res) => {
        barangController.searchBarang(req, res);
    });
    app.get('/barang/:id', (req, res) => {
        barangController.getBarang(req, res);
    });
    app.put('/barang/:id', checkToken_middleware_1.checkToken, (req, res) => {
        barangController.updateBarang(req, res);
    });
    app.delete('/barang/:id', checkToken_middleware_1.checkToken, (req, res) => {
        barangController.deleteBarangById(req, res);
    });
    // Route for managing perusahaan
    app.post('/perusahaan', checkToken_middleware_1.checkToken, (req, res) => {
        perusahaanController.createPerusahaan(req, res);
    });
    app.get('/perusahaan', (req, res) => {
        perusahaanController.searchPerusahaan(req, res);
    });
    app.get('/perusahaan/:id', (req, res) => {
        perusahaanController.getPerusahaanById(req, res);
    });
    app.put('/perusahaan/:id', checkToken_middleware_1.checkToken, (req, res) => {
        perusahaanController.updatePerusahaan(req, res);
    });
    app.delete('/perusahaan/:id', checkToken_middleware_1.checkToken, (req, res) => {
        perusahaanController.deletePerusahaanById(req, res);
    });
    /* Nonexisting Route handling */
    app.all('*', (req, res) => {
        res.status(404).json({ error: 'Cannot access route' });
    });
}
exports.default = routes;
