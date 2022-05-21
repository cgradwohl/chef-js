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
class UpdateItemMutationBuilder {
  protected _query: Query;

  public get query() {
    return this._query;
  }

  // constructor(table: string, key: DocumentClient.Key) {
  //   this._query = new UpdateItemQueryBuilder(table, key);
  // }

  constructor(table: string, key: DocumentClient.Key) {
    this._query = {
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      Key: key,
      TableName: table,
      UpdateExpression: "SET",
    };
  }

  protected addExpressionAttributeName(key: string, value: string) {
    this._query.ExpressionAttributeNames[key] = value;
    return this;
  }

  protected addExpressionAttributeValue<T>(key: string, value: T) {
    this._query.ExpressionAttributeValues[key] = value;
    return this;
  }

  protected addUpdateExpression(expression: string) {
    this._query.UpdateExpression += ` ${expression},`;
    return this;
  }

  public setValue<T>(key: string, value: T) {
    this.addExpressionAttributeName(`#${key}`, key);
    this.addExpressionAttributeValue(`:${key}`, value);
    this.addUpdateExpression(`#${key} = :${key}`);
    return this;
  }

  public build(): UpdateItemInput {
    return this._query;
  }

  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}

// message implementation of a dynamo update item mutation builder
class MessageUpdateItemMutationBuilder extends UpdateItemMutationBuilder {
  constructor(workspaceId: string, messageId: string) {
    const table = "MessagesDynamoTable"; // would get this from process.env
    const key = { pk: `${workspaceId}/${messageId}` };
    super(table, key);
  }
}

// basic visitor type
interface Visitor {
  visit(builder: UpdateItemMutationBuilder): void;
}

// concrete example implementation
class BilledUnitsVisitor implements Visitor {
  private _event: ISafeEventLogEntry;

  constructor(event: ISafeEventLogEntry) {
    this._event = event;
  }

  visit(builder: MessageUpdateItemMutationBuilder): void {
    if (
      ["provider:error", "provider:sent", "undeliverable"].includes(
        this._event.type
      )
    ) {
      builder.setValue("billedUnits", 1);
    }
  }
}

class UpdateStatusVisitor implements Visitor {
  private _event: ISafeEventLogEntry;

  constructor(event: ISafeEventLogEntry) {
    this._event = event;
  }

  visit(builder: MessageUpdateItemMutationBuilder): void {
    builder.setValue("status", this._event.status);
  }
}

class UpdateChannelsVisitor implements Visitor {
  private _event: ISafeEventLogEntry;

  constructor(event: ISafeEventLogEntry) {
    this._event = event;
  }

  visit(builder: MessageUpdateItemMutationBuilder): void {
    builder.setValue("channels", this._event.channels);
  }
}

// putting it all together
const main = async (event: ISafeEventLogEntry) => {
  const visitors = [
    new BilledUnitsVisitor(event),
    new UpdateStatusVisitor(event),
    new UpdateChannelsVisitor(event),
  ];

  const messageUpdateItemBuilder = new MessageUpdateItemMutationBuilder(
    event.tenantId,
    event.messageId
  );

  for (const visitor of visitors) {
    messageUpdateItemBuilder.accept(visitor);
  }

  const query = messageUpdateItemBuilder.build();
  console.log(query);
};

const event: ISafeEventLogEntry = {
  channels: "MOCK",
  id: "SOME_EVENT_ID",
  json: JSON.stringify({}),
  messageId: "SOME_MESSAGE_ID",
  status: "ENQUEDED",
  tenantId: "SOME_WORKSPACE_ID",
  timestamp: Date.now(),
  type: "provider:sent",
};
main(event);
