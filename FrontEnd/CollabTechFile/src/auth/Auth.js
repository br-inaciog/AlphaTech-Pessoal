import { jwtDecode } from "jwt-decode";

export const userDecodeToken = (token) => {
    if (!token) return null;

    const dec = jwtDecode(token);

    return {
        idUsuario: dec.jti,
        nome: dec.name,
        email: dec.email,
        tipoUsuario: dec.TipoUsuario, 
        token
    };
};
