import { AxiosResponse } from "axios";
import { Document, Node as DOMNode, Element as DOMElement } from "domhandler";
import { Options as CssSelectOptions } from "css-select";
import { CompiledQuery } from "css-select/lib/types";
export { Element as DOMElement } from "domhandler";
export declare function request(url: string, requestorRef: string, headers: {
    [key: string]: string;
}, reqBody: string): Promise<AxiosResponse<string>>;
export declare function selectAll(query: string, elements: DOMNode | DOMNode[] | null, options?: CssSelectOptions<DOMNode, DOMElement>): DOMElement[];
export declare function selectOne(query: string, elements: DOMNode | DOMNode[] | null, options?: CssSelectOptions<DOMNode, DOMElement>): DOMElement | null;
export declare function compile(selector: string, options: CssSelectOptions<DOMNode, DOMElement> | undefined, context: DOMNode | DOMNode[] | undefined): CompiledQuery<DOMElement>;
export declare function getText(node: DOMNode | DOMNode[] | null): string | null;
export declare function parseResponse(data: string): Document;
export declare function requestAndParse(url: string, requestorRef: string, headers: {
    [key: string]: string;
}, reqBody: string): Promise<Document>;
