"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// builder to abstract logic for cobbling together dynamo structure changes
class UpdateItemQueryBuilder {
    constructor(table, key) {
        this._query = {
            ExpressionAttributeNames: {},
            ExpressionAttributeValues: {},
            Key: key,
            TableName: table,
            UpdateExpression: "SET",
        };
    }
    addExpressionAttributeName(key, value) {
        this._query.ExpressionAttributeNames[key] = value;
        return this;
    }
    addExpressionAttributeValue(key, value) {
        this._query.ExpressionAttributeValues[key] = value;
        return this;
    }
    addUpdateExpression(expression) {
        this._query.UpdateExpression += ` ${expression}`;
        return this;
    }
    setValue(key, value) {
        this.addExpressionAttributeName(`#${key}`, key);
        this.addExpressionAttributeValue(`:${key}`, value);
        this.addUpdateExpression(`#${key} = :${key}`);
        return this;
    }
    build() {
        return this._query;
    }
}
class DynamoUpdateItemMutationBuilder {
    constructor(table, key) {
        this._mutations = new UpdateItemQueryBuilder(table, key);
    }
    get mututations() {
        return this._mutations;
    }
    accept(visitor) {
        visitor.visit(this);
    }
}
// message implementation of a dynamo update item mutation builder
class MessageChangeBuilder extends DynamoUpdateItemMutationBuilder {
    constructor(workspaceId, messageId) {
        const table = "MessagesDynamoTable"; // would get this from process.env
        const key = { pk: `${workspaceId}/${messageId}` };
        super(table, key);
    }
}
// concrete example implementation
class BilledUnitsVisitor {
    constructor(event) {
        this._event = event;
    }
    visit(builder) {
        if (["provider:error", "provider:sent", "undeliverable"].includes(this._event.type)) {
            builder.mututations.setValue("billedUnits", 1);
        }
    }
}
// putting it all together
const event = {
    id: "SOME_EVENT_ID",
    json: JSON.stringify({}),
    messageId: "SOME_MESSAGE_ID",
    tenantId: "SOME_WORKSPACE_ID",
    timestamp: Date.now(),
    type: "provider:sent",
};
const visitors = [new BilledUnitsVisitor(event)];
const messagesMutationBuilder = new MessageChangeBuilder(event.tenantId, event.messageId);
for (const visitor of visitors) {
    messagesMutationBuilder.accept(visitor);
}
const query = messagesMutationBuilder.mututations.build();
console.log(query);
