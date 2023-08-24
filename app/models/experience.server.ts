
import { prisma } from "../db.server";

export async function createExperience(comentario: string, profileId: string){
    const result = prisma.experience.create({
        data: { comentario: comentario, profile: { connect: { id: profileId } } },
    })
    
    return result
}

export async function getExperience() {
    const result =  prisma.experience.findMany({
        include: { profile: {select: {avatarUrl: true }}}
    });
    return result
};

export async function updateExperience() {
    
}
