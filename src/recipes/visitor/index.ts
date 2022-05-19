import { DocumentClient, UpdateItemInput } from "aws-sdk/clients/dynamodb";
interface ISafeEventLogEntry extends Record<string, any> {
  messageId: string;
  tenantId: string;
}
interface Query extends UpdateItemInput {
  ExpressionAttributeNames: Record<string, any>;
  ExpressionAttributeValues: Record<string, any>;
  Key: DocumentClient.Key;
  TableName: string;
  UpdateExpression: "SET";
}

// builder to abstract logic for cobbling together dynamo structure changes
class UpdateItemQueryBuilder {
  protected _query: Query;

  constructor(table: string, key: DocumentClient.Key) {
    this._query = {
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      Key: key,
      TableName: table,
      UpdateExpression: "SET",
    };
  }

  protected addExpressionAttributeName(
    key: string,
    value: string
  ): UpdateItemQueryBuilder {
    this._query.ExpressionAttributeNames[key] = value;
    return this;
  }

  protected addExpressionAttributeValue<T>(
    key: string,
    value: T
  ): UpdateItemQueryBuilder {
    this._query.ExpressionAttributeValues[key] = value;
    return this;
  }

  protected addUpdateExpression(expression: string) {
    this._query.UpdateExpression += ` ${expression}`;
    return this;
  }

  public setValue<T>(key: string, value: T): UpdateItemQueryBuilder {
    this.addExpressionAttributeName(`#${key}`, key);
    this.addExpressionAttributeValue(`:${key}`, value);
    this.addUpdateExpression(`#${key} = :${key}`);
    return this;
  }

  public build(): UpdateItemInput {
    return this._query;
  }
}

class DynamoUpdateItemMutationBuilder {
  protected _mutations: UpdateItemQueryBuilder;

  public get mututations(): UpdateItemQueryBuilder {
    return this._mutations;
  }

  constructor(table: string, key: DocumentClient.Key) {
    this._mutations = new UpdateItemQueryBuilder(table, key);
  }

  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}

// message implementation of a dynamo update item mutation builder
class MessageChangeBuilder extends DynamoUpdateItemMutationBuilder {
  constructor(workspaceId: string, messageId: string) {
    const table = "MessagesDynamoTable"; // would get this from process.env
    const key = { pk: `${workspaceId}/${messageId}` };
    super(table, key);
  }
}

// basic visitor type
interface Visitor {
  visit(builder: DynamoUpdateItemMutationBuilder): void;
}

// concrete example implementation
class BilledUnitsVisitor implements Visitor {
  private _event: ISafeEventLogEntry;

  constructor(event: ISafeEventLogEntry) {
    this._event = event;
  }

  visit(builder: MessageChangeBuilder): void {
    if (
      ["provider:error", "provider:sent", "undeliverable"].includes(
        this._event.type
      )
    ) {
      builder.mututations.setValue("billedUnits", 1);
    }
  }
}

// putting it all together
const event: ISafeEventLogEntry = {
  id: "SOME_EVENT_ID",
  json: JSON.stringify({}),
  messageId: "SOME_MESSAGE_ID",
  tenantId: "SOME_WORKSPACE_ID",
  timestamp: Date.now(),
  type: "provider:sent",
};

const visitors = [new BilledUnitsVisitor(event)];

const messagesMutationBuilder = new MessageChangeBuilder(
  event.tenantId,
  event.messageId
);

for (const visitor of visitors) {
  messagesMutationBuilder.accept(visitor);
}

const query = messagesMutationBuilder.mututations.build();
console.log(query);
