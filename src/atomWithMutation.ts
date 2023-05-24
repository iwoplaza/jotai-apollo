import {
  ApolloClient,
  DefaultContext,
  DocumentNode,
  MutationOptions,
  OperationVariables,
} from '@apollo/client'
import { Getter, atom } from 'jotai'

import { clientAtom } from './clientAtom'

export const atomWithMutation = <
  Data = any,
  Variables extends OperationVariables = OperationVariables,
  Context extends Record<string, any> = DefaultContext
>(
  mutation: DocumentNode,
  onError?: (error: unknown) => void,
  getClient: (get: Getter) => ApolloClient<unknown> = (get) => get(clientAtom)
) => {
  return atom(
    null,
    async (
      get,
      _set,
      options: Omit<MutationOptions<Data, Variables, Context>, 'mutation'>
    ) => {
      const client = getClient(get)

      try {
        return client.mutate({
          ...options,
          mutation: mutation as any,
        })
      } catch (e) {
        if (onError) {
          onError(e)
          return { data: undefined, errors: e }
        }

        throw e
      }
    }
  )
}
