const {transformSync} = require('@babel/core');
module.exports = function addTryCatchPlugin(babel) {
    const { types: t } = babel;

    return {
        name: "add-try-catch",
        visitor: {
            Function(path) {
                if (path.node.async) { // 跳过异步函数
                    return;
                }

                if (path.findParent((path) => path.isFunction())) { // 跳过嵌套函数
                    return;
                }

                let hasTryCatch = false;
                path.traverse({
                    TryStatement() {
                        hasTryCatch = true;
                    },
                });

                if (!hasTryCatch) {
                    let functionName = path.node.id?.name;
                    if (!functionName) {
                        const uid = path.scope.generateUidIdentifier("func");
                        functionName = uid.name;
                    }

                    const functionBody = path.node.body.body;

                    const tryCatchBlock = t.tryStatement(
                        t.blockStatement(functionBody),
                        t.catchClause(
                            t.identifier("e"),
                            t.blockStatement([
                                t.expressionStatement(
                                    t.callExpression(t.memberExpression(t.identifier("console"), t.identifier("error")), [
                                        t.stringLiteral("Error caught in function: " + functionName),
                                        t.callExpression(t.memberExpression(t.identifier("JSON"), t.identifier("stringify")), [
                                            t.identifier("arguments")
                                        ]),
                                        t.identifier("e.stack"), // 打印错误的堆栈信息
                                    ])
                                ),
                            ])
                        )
                    );

                    path.node.body.body = [tryCatchBlock];
                }
            },
        },
    };
};

const sourceCode = `
function test(a, b) {
    console.log(test)
}
`
const {code} = transformSync(sourceCode,{
  filename:'some.js',
  plugins:[addTryCatchPlugin]
});
console.log(code);