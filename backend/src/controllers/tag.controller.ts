import { Request, Response } from "express";
import { Tag } from "@prisma/client";

export const getAllTags = async (req: Request, res: Response) => {
    try {
        const tags = Object.values(Tag);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
