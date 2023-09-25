export interface Categories {
    href: string,
    items:Category[],
    limit: number,
    offset: number,
    next: string | null
    previous: string | null,
    total: number
}

export interface Category {
    href: string,
    icons: {
        height: number,
        width: number,
        url: string
    }[],
    id: string,
    name: string
}