import type { File, Team, TeamMember, User, Message } from '@/interfaces/Interfaces'
import React from 'react'

export const Users: User[] = [
    {
        id: "nvfjdnjsnvl",
        firstName: "Allan",
        lastName: "Shinhama",
        email: "allanshinham@gmail.com",
        password: "allna",
        messages: [],
        createdAt: "19/02/2026" 
    },
    {
        id: "dcnsjncjiasc",
        firstName: "Carlos",
        lastName: "Eduardo",
        email: "carloseduardo@gmail.com",
        password: "belo",
        messages: [],
        createdAt: "19/03/2026" 
    },
    {
        id: "kijdoiwnjdicdnjk",
        firstName: "Emanuelly",
        lastName: "Ferreira",
        email: "emanuellyferreir@gmail.com",
        password: "casa",
        messages: [],
        createdAt: "20/03/2024" 
    },
    {
        id: "cdsonmcosmaskkoç",
        firstName: "Pedro",
        lastName: "Henrique da Silva",
        email: "prdro@gmail.com",
        password: "shinhama",
        messages: [],
        createdAt: "19/02/2026" 
    },
]

export const Files: File[] = [
    {
        id: "nvfjdnjsnvl",
        name: "Manual_de_Processos.pdf",
        description: "Manual de processos da empresa",
        fileAddress: "./src/assets/file/06_08_24.pdf",
        fileSize: "2MB",
        uploadedBy: Users[1]!,  // Ele tem que ser um valor não nulo
        createdAt: "19/02/2026" 
    },
    {
        id: "ndvhsbk",
        name: "Guia_de_Desenvolvimento.pdf",
        description: "Boas Práticas e padrões de código",
        fileAddress: "./src/assets/file/07_05_2024.pdf",
        fileSize: "2.6MB",
        uploadedBy: Users[1]!,
        createdAt: "24/01/2026" 
    },
    {
        id: "huhrkacdsnalj",
        name: "Codigo_Base.pdf",
        description: "Manual de processos da empresa",
        fileAddress: "src/assets/files/10_24.pdf",
        fileSize: "1MB",
        uploadedBy: Users[1]!,
        createdAt: "20/01/2026" 
    },
    {
        id: "asdjvbrhfsb",
        name: "Política_de_Segurança.pdf",
        description: "Manual de processos da empresa",
        fileAddress: "src/assets/files/11_24.pdf",
        fileSize: "1.6MB",
        uploadedBy: Users[1]!,
        createdAt: "19/02/2026" 
    }
]

const TeamMembers: TeamMember[] = [
    {
        status: 'admin',
        user: Users[0]
    },
    {
        status: 'participant',
        user: Users[1]
    },
    {
        status: 'participant',
        user: Users[2]
    },
    {
        status: 'participant',
        user: Users[3]
    },
]

export const Teams: Team[] = [
    {
        id: "nvjfdsnvkjfs",
        title: "Setor de Desenvolvimento Front-end",
        description: "Chatbot com suporte a documentos front-end da empresa",
        code: "chave1",
        ownerId: Users[1]?.id,
        members: TeamMembers,
        createdAt: "09/07/2025"
    }
]