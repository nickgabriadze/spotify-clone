import React from "react";

export function checkInView(element: React.RefObject<HTMLDivElement>): boolean {

    const elementClientRect = element?.current?.getBoundingClientRect();
    console.log(elementClientRect)
    console.log(window.innerWidth, window.innerHeight)

    return elementClientRect ? (elementClientRect.top >= 50 &&
        elementClientRect.left >= 0 &&
        elementClientRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        elementClientRect.right <= (window.innerWidth || document.documentElement.clientWidth)) : true
}