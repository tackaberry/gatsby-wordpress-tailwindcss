import React from "react"
import parse from "html-react-parser";

import { Careers } from "../components/careers";
import { Categories } from "../components/categories";

const handleShortcodes = (node) => {
    let shortcode = ""
    console.log(node);
    if (node.type && node.type === "tag") {
        shortcode = node.children[0]?.data;
    }
    if (node.type && node.type === "text") {
        shortcode = node.data.trim();
    }

    if (shortcode === "[categories]") {
        return <Categories />;
    }

    if (shortcode === "[careers]") {
        return <Careers />;
    }
    
    return node;
};


const parseContent = ( content ) => {
    const reactElements = parse( content || "", {
        replace: handleShortcodes,
    });

    return reactElements;
};


export { parseContent }