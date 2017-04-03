/**
 * Created by Kyrill on 28.03.2017.
 */

import 'brace/mode/c_cpp';
import 'brace/mode/coffee';
import 'brace/mode/csharp';
import 'brace/mode/css';
import 'brace/mode/html';
import 'brace/mode/java';
import 'brace/mode/javascript'
import 'brace/mode/json';
import 'brace/mode/jsx';
import 'brace/mode/latex';
import 'brace/mode/lua';
import 'brace/mode/markdown';
import 'brace/mode/objectivec';
import 'brace/mode/php';
import 'brace/mode/python';
import 'brace/mode/sass';
import 'brace/mode/scss';
import 'brace/mode/sql';
import 'brace/mode/swift';
import 'brace/mode/tex';
import 'brace/mode/typescript';
import 'brace/mode/xml';
import 'brace/mode/yaml';
import 'brace/mode/plain_text';
import 'brace/mode/text';

function getModeValues()
{
    return [
        {value: "c_cpp", label: "C/C++"},
        {value: "coffee", label: "CoffeeScript"},
        {value: "csharp", label: "C#"},
        {value: "css", label: "CSS"},
        {value: "html", label: "HTML"},
        {value: "java", label: "Java"},
        {value: "javascript", label: "JavaScript"},
        {value: "json", label: "JSON"},
        {value: "jsx", label: "JSX"},
        {value: "latex", label: "LaTeX"},
        {value: "lua", label: "Lua"},
        {value: "markdown", label: "Markdown"},
        {value: "objectivec", label: "Objective C"},
        {value: "php", label: "PHP"},
        {value: "python", label: "Python"},
        {value: "sass", label: "SASS"},
        {value: "scss", label: "SCSS"},
        {value: "sql", label: "SQL"},
        {value: "swift", label: "Swift"},
        {value: "tex", label: "TeX"},
        {value: "typescript", label: "TypeScript"},
        {value: "xml", label: "XML"},
        {value: "yaml", label: "YAML"},
        {value: "plain_text", label: "Plain Text"},
        {value: "text", label: "Text"}
    ];
}

module.exports = {
    getModeValues: getModeValues
};