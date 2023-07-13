import jwt from 'jsonwebtoken';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQB2PnPNqK4jMbz4PtVznUTQITgO7ycpznj8X9dwAnvo4FGYUQFY
KohDjt7DSifNFOWhvJnwFGRgyikLnSGttyPt2M37PJnNHGVTH30x5TUtVU2wZhZv
7Fa+A8FFSIYw9ychwY++NI+HnyYgwj+uQtCkNqu9IbiCjo68IaAxDeyu7K81QLdm
24VC4UZQY8fg+Jr93/6lpahilmZDXMzBV0mXGDEbGlJTgN7dSldMsUhdAl7Juxff
JtjWxlV+jaHmUndkPN6SYlONbaL27wpQG6tW05Dv4K4lo+vnXOxYpGRYc+/6HhiR
yPz0/cC92jmrI/PKeZBa3linpwZ6FQ5y633DAgMBAAECggEAG3VnSQP55FxhiLh2
sxF7cGW2celhi9jRybGsAuvgwHSPHjL5f/Loj9+2pV0sHvjSVpvIl7L0mHF51KOZ
tZCI/GvTcZtiD/qfIQ138kVK8wsTLnqWjUkx35BZqnAsEWTjpngfnEjyZ8kyfnr9
dMc5UlkLyrDw+wiF5vRcEegs5XXppG0D/eJ8zRTFcjuEkFrmk0hmtbeYKzKVc9LQ
i0NpkUigI7fn28suxGvigVT5Ss3zguNbSLROnkAFwtYMlaAN9O5mSDszyENC4R1l
5Py7viMIuWEp4O+/bwfED5ajM8cibgDAhekDu9I6gtQBj2+WABH8fCZMMafu6F2V
PABvGQKBgQDII8B8QooW99Uk6GLUXwaZb3r2pZBLjyaZaOGdkinzcpaRYTFSpbFh
3MVJDrErFkS05pAbwjwrA8/izK4bC948KY7lz8d/jyLqPNwliCQoNnEnryvPl3WK
Q6wCZQsGpRvlRbNJljEda28inOG/Yt/PEIH5A/YvOYXZO19bHA7xfwKBgQCXPyRq
H/QP83NNV8WgbjCH/Ll5IwyiZsKIO8DEVeIU8v+oO11KPCqmK3yUPDnmrchfkxXA
88MtfJetiY5kQgK60T0zGhVEvLj7Oydy6aps/f0zeAQgPXI/i/yfv3EmfJ6JFEcJ
vpdKWpwvzGKyPRPkrXPW0egBMehyUviN4sBNvQKBgQCrj9Ip8pQTGkGREM/fQtIS
ZzjeA5DM5Jpu+TQl8ayabsjZOJqiQTzsKebIOJrw13bwJ5Cy6u7O5MaooVJCBwtr
QSiooVNfamDAsIj6d1ifTAP1w7hnjGsKqfXiW6F3AcQG5pfI5cGWeYjb/+WYPPaj
tn/j6Vx4oPO3Aqk8HbJFmwKBgEYhxEvldzFyTNPfUEdc8OoNuR8/rlsb1TaAppkj
zcqzBvNGW7LRhWE6JvFBoAOkL5aJyHuJTMap0Fdqwnkg1s0zuvIYNSaDcC8mtdsm
GJ2jhKY6D4e3lmN7EPAuQFR9UrHzkiElnFeg/m13k4hco/3UpDNHcBIlx0hDyvdX
3p3tAoGAAgvVYazq6BupykNUIyE2zlAJs+4O2e25e99Ttq5LrEP7UD3hFlxoFQm0
6nbnfIyAcnN2VLF2jtyWM9QV2ipm+QCiI5/YqJOYtuG39INM7+OTpIDHbFnAsE+4
sCuwyoJylzyU6zARKf+4NzcOmxImQm1Br4HflsaDiY1sfR+Ki2E=
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB2PnPNqK4jMbz4PtVznUTQ
ITgO7ycpznj8X9dwAnvo4FGYUQFYKohDjt7DSifNFOWhvJnwFGRgyikLnSGttyPt
2M37PJnNHGVTH30x5TUtVU2wZhZv7Fa+A8FFSIYw9ychwY++NI+HnyYgwj+uQtCk
Nqu9IbiCjo68IaAxDeyu7K81QLdm24VC4UZQY8fg+Jr93/6lpahilmZDXMzBV0mX
GDEbGlJTgN7dSldMsUhdAl7JuxffJtjWxlV+jaHmUndkPN6SYlONbaL27wpQG6tW
05Dv4K4lo+vnXOxYpGRYc+/6HhiRyPz0/cC92jmrI/PKeZBa3linpwZ6FQ5y633D
AgMBAAE=
-----END PUBLIC KEY-----`;


export function signJWT(payload: object, expiresIn: string | number){
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: expiresIn });
}

export function verifyJWT(token: string){
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256']});
        return {payload: decoded, expired: false};
    } catch (e) {
        return {payload: null, expired: true};
    }
}