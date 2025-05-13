import { Tag } from "@prisma/client";

export const validateTags = (inputTags: unknown): Tag[] => {
    if (!Array.isArray(inputTags)) {
        throw new Error('Input must be an array.');
    }
    const validTags = Object.values(Tag);

    for (const tag of inputTags) {
        if (typeof tag !== 'string') {
            throw new Error(`Each tag must be a string. Invalid tag: "${tag}".`);
        }
        if (!validTags.includes(tag as Tag)) {
            throw new Error(`Invalid tag value: "${tag}". Allowed values are: ${validTags.join(', ')}`);
        }
    }

    return inputTags as Tag[];
}