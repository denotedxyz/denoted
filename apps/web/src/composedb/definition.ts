// This is an auto-generated file, do not edit manually
import type { RuntimeCompositeDefinition } from '@composedb/types'
export const definition: RuntimeCompositeDefinition = {"models":{"Page":{"id":"kjzl6hvfrbw6carwmyx94qjmnby7ccb1zf57np6axphuxmhi6rwrhy0gogauvwh","accountRelation":{"type":"list"}}},"objects":{"PageNode":{"text":{"type":"string","required":false},"type":{"type":"string","required":true},"attrs":{"type":"string","required":false},"marks":{"type":"string","required":false},"content":{"type":"string","required":false}},"Page":{"key":{"type":"string","required":false},"data":{"type":"list","required":false,"item":{"type":"reference","refType":"object","refName":"PageNode","required":false}},"type":{"type":"string","required":true},"title":{"type":"string","required":true},"createdAt":{"type":"datetime","required":true},"deletedAt":{"type":"datetime","required":false},"updatedAt":{"type":"datetime","required":false},"version":{"type":"view","viewType":"documentVersion"},"createdBy":{"type":"view","viewType":"documentAccount"},"deletedBy":{"type":"view","viewType":"documentAccount"},"updatedBy":{"type":"view","viewType":"documentAccount"}}},"enums":{},"accountData":{"pageList":{"type":"connection","name":"Page"}}}