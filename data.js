let participantes = [
    {
        id: 1,
        nombre: "Juliana",
        apellidos: "Rubio",
        email: "juliana@mail.com",
        twitter: "@JRubio",
        ocupacion: "Desarrolladora de Software",
        avatar: "avatar1.png",
        aceptaTerminos: true
    },
    {
        id: 2,
        nombre: "Raúl",
        apellidos: "Medina",
        email: "raul@mail.com",
        twitter: "@RaulMedina",
        ocupacion: "Ingeniero Front-End",
        avatar: "avatar2.png",
        aceptaTerminos: true
    },
    {
        id: 3,
        nombre: "Corice",
        apellidos: "Andrade",
        email: "corice@mail.com",
        twitter: "@CAndrade",
        ocupacion: "Desarrollador Web Full Stack",
        avatar: "avatar3.png",
        aceptaTerminos: true
    }
];

let nextId = participantes.length > 0 ? participantes[participantes.length - 1].id + 1 : 1; 

module.exports = {
    participantes,
    getNextId: () => nextId++,
};