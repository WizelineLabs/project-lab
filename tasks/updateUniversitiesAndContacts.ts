import fs from "fs";
import csv from "csv-parser";
import { PrismaClient} from "@prisma/client";

type ContactType = {
    fullName : string,
    university: string
};

const prisma = new PrismaClient();
const csvFileName = process.argv[2];
const universityList : string[] = [];
const contactsList : ContactType[] = [];

fs.createReadStream(csvFileName)
  .pipe(csv())
  .on("data", async (row: any) => {
    
    const uni = row["Organization"].trim() as string;
    universityList.push(uni);

    let contact = row["Contact"] as string;
    if (contact.trim().length > 0){
        contact = contact.split("<")[0].trim();
        if (contact.trim().length > 0){
            contactsList.push({
                fullName: contact,
                university: uni
            });
        }
    }
  })
  .on("end", async () => {
    console.log("CSV file successfully processed");

    // UPSERT UNIVERSITIES
    const universities = [...new Set(universityList)];
    universities.forEach(async uni => {
        await prisma.$transaction(async (tx) => {
            await tx.universities.upsert({
                where:{
                    name: uni
                },
                create:{
                    name: uni
                },
                update: {}
            })
            .then(u => console.log("Upserted university: " + u.name))
            .catch(e => console.error("Failed to upsert university: "+ uni))
            .catch(e => console.error(e));
        });
    });

    // CONTACTS
    contactsList.forEach(async (contact) => {
        await prisma.$transaction(async (tx) => {
            // FIND CONTACT
            await tx.universityPointsOfContact.findFirst({
                where:{
                    fullName: contact.fullName,
                    university: {
                        name: contact.university
                    }
                },
                select: {
                    id: true
                }
            }).then(async poc => {
                if (poc != null){
                    // UPSERT CONTACT
                    await tx.universityPointsOfContact.upsert({
                        where : {
                            id: poc?.id
                        },
                        create : {
                            fullName: contact.fullName,
                            university: {
                                connect: {
                                    name : contact.university
                                }
                            }
                        },
                        update: {},
                        select :{
                            fullName: true,
                            university: {
                                select:{
                                    name:true
                                }
                            }
                        }
                    })
                    .then(c=>console.log('Upserted contact: '+c.fullName+'. University: '+c.university.name))
                    .catch(e=> console.error(">>> Failed to upsert contact: "+contact.fullName))
                    .catch(e=> console.error(e));
                } else {
                    // CREATE CONTACT
                    await tx.universityPointsOfContact.create({
                        data: {
                            fullName: contact.fullName,
                            university: {
                                connect: {
                                    name : contact.university
                                }
                            }
                        },
                        select :{
                            fullName: true,
                            university: {
                                select:{
                                    name:true
                                }
                            }
                        }
                    })
                    .then(c=>console.log('Created contact: '+c.fullName+'. University: '+c.university.name))
                    .catch(e=> console.error(">>> Failed to create contact: "+contact.fullName))
                    .catch(e=> console.error(e));
                }
                
            });
        });
    });

  });





