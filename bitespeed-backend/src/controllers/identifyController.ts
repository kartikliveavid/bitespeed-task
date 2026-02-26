import { Request, Response } from 'express';
import prisma from '../prisma.js';

export const identify = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Either email or phoneNumber must be provided" });
    }

    // 1. Find all contacts matching the given email or phoneNumber
    const matchingContacts = await prisma.contact.findMany({
        where: {
            OR: [
                { email: email || undefined },
                { phoneNumber: phoneNumber || undefined }
            ]
        }
    });

    if (matchingContacts.length === 0) {
        // 3. New Customer: No match, create a primary contact
        const newContact = await prisma.contact.create({
            data: {
                email: email || null,
                phoneNumber: phoneNumber || null,
                linkPrecedence: "primary"
            }
        });

        return res.status(200).json({
            contact: {
                primaryContactId: newContact.id,
                emails: [newContact.email].filter(Boolean),
                phoneNumbers: [newContact.phoneNumber].filter(Boolean),
                secondaryContactIds: []
            }
        });
    }

    // 2. Identify the root primary contacts involved
    const rootIds = new Set<number>();
    for (const contact of matchingContacts) {
        rootIds.add(contact.linkPrecedence === "primary" ? contact.id : contact.linkedId!);
    }

    // Fetch all contacts belonging to these root ids to find the ultimate primary
    let allRelatedContacts = await prisma.contact.findMany({
        where: {
            OR: [
                { id: { in: Array.from(rootIds) } },
                { linkedId: { in: Array.from(rootIds) } }
            ]
        }
    });

    // Re-calculate root IDs in case secondary contacts pointed to different trees
    const finalRootIds = new Set<number>();
    for (const contact of allRelatedContacts) {
        finalRootIds.add(contact.linkPrecedence === "primary" ? contact.id : contact.linkedId!);
    }

    const primaryContacts = await prisma.contact.findMany({
        where: { id: { in: Array.from(finalRootIds) }, linkPrecedence: "primary" },
        orderBy: { createdAt: 'asc' }
    });

    const primaryContact = primaryContacts[0];
    const primaryId = primaryContact.id;

    // 4. Handle linking and new info
    const existingEmails = new Set(allRelatedContacts.map((c: any) => c.email).filter(Boolean));
    const existingPhoneNumbers = new Set(allRelatedContacts.map((c: any) => c.phoneNumber).filter(Boolean));

    const isNewEmail = email && !existingEmails.has(email);
    const isNewPhone = phoneNumber && !existingPhoneNumbers.has(phoneNumber);

    // If there are multiple primary contacts, convert others to secondary
    if (primaryContacts.length > 1) {
        const idsToConvert = primaryContacts.slice(1).map((c: any) => c.id);
        await prisma.contact.updateMany({
            where: {
                OR: [
                    { id: { in: idsToConvert } },
                    { linkedId: { in: idsToConvert } }
                ]
            },
            data: {
                linkedId: primaryId,
                linkPrecedence: "secondary"
            }
        });

        // Refresh allRelatedContacts after update
        allRelatedContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { id: primaryId },
                    { linkedId: primaryId }
                ]
            }
        });
    } else if (isNewEmail || isNewPhone) {
        // Create new secondary contact if there's new info
        const newSecondary = await prisma.contact.create({
            data: {
                email: email || null,
                phoneNumber: phoneNumber || null,
                linkedId: primaryId,
                linkPrecedence: "secondary"
            }
        });
        allRelatedContacts.push(newSecondary);
    }

    // 5. Aggregate result
    const emails = Array.from(new Set(allRelatedContacts.map((c: any) => c.email).filter(Boolean)));
    const phoneNumbers = Array.from(new Set(allRelatedContacts.map((c: any) => c.phoneNumber).filter(Boolean)));
    const secondaryContactIds = allRelatedContacts
        .filter((c: any) => c.linkPrecedence === "secondary")
        .map((c: any) => c.id);

    // Ensure primary contact email/phone are first in their respective arrays (optional but cleaner)
    const resultEmails = [primaryContact!.email, ...emails.filter((e: any) => e !== primaryContact!.email)].filter(Boolean);
    const resultPhones = [primaryContact!.phoneNumber, ...phoneNumbers.filter((p: any) => p !== primaryContact!.phoneNumber)].filter(Boolean);

    return res.status(200).json({
        contact: {
            primaryContactId: primaryId,
            emails: resultEmails,
            phoneNumbers: resultPhones,
            secondaryContactIds: secondaryContactIds
        }
    });
};
