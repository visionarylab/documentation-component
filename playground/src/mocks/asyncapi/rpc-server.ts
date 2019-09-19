export const rpcServer = `
asyncapi: '2.0.0'
id: 'urn:rpc:example:server'
defaultContentType: application/json

info:
  title: RPC Server Example
  description: This example demonstrates how to define an RPC server.
  version: '1.0.0'

servers:
  production:
    url: rabbitmq.example.org
    protocol: amqp

channels:
  '{queue}':
    parameters:
      queue:
        schema:
          type: string
          pattern: '^amq\\.gen\\-.+$'
    bindings:
      amqp:
        is: queue
        queue:
          exclusive: true
    publish:
      operationId: sendSumResult
      bindings:
        amqp:
          ack: true
      message:
        correlationId:
          location: $message.header#/correlation_id
        payload:
          type: object
          properties:
            result:
              type: number
              examples:
                - 7

  rpc_queue:
    bindings:
      amqp:
        is: queue
        queue:
          durable: false
    subscribe:
      operationId: sum
      message:
        bindings:
          amqp:
            replyTo:
              type: string
        correlationId:
          location: $message.header#/correlation_id
        payload:
          type: object
          properties:
            numbers:
              type: array
              items:
                type: number
              examples:
                - [4,3]
`;
