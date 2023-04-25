import { iContactData } from "../../@types/myTypes";

export const sacciData: iContactData = {
    phone: '+5511997645981',
    name: "Lucas Sacci",
    registered: true,
    address: {
        street: 'Rua João de Passos',
        number: 484,
        district: 'Centro',
        cep: 12960000,
        complement: ""
    }
}

export const estefaniData: iContactData = {
    phone: "+5511972277826",
    name: "Estéfani de Camargo",
    registered: true,
    address: {
        street: 'Rua Bragança',
        number: 213,
        district: 'Jardim Paulista',
        cep: 12947452,
        complement: ""
    }
}

export const newEstefaniData: iContactData = {
    phone: "+5511972277826",
    name: "Estéfani de Garcez Camargo",
    registered: true,
    address: {
        street: 'Rua Bragança Paulista',
        number: 220,
        district: 'Jardim Paulista II',
        cep: 12947452,
        complement: "Kombi Vermelha na Frente"
    }
}

export const jhonatanData: iContactData = {
    phone: '+5511955546146',
    name: 'Jhonatan Tabajara',
    registered: true
}

export const wrongPhone = '+551159597874'