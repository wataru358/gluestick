/* @flow */

import type { PromiseMiddleware } from '../types';

const promiseMiddleware: PromiseMiddleware = client => (dispatch, getState) => next => action => {
  const { promise, type, formatter, ...rest } = action;

  if (!promise) {
    return next(action);
  }

  const SUCCESS = type;
  const INIT = `${type}_INIT`;
  const FAILURE = `${type}_FAILURE`;

  next({ ...rest, type: INIT });

  if(Array.isArray(promise)) {

    const promiseArray = promise.map(p => {
      typeof p === 'function' ? p(client) : p;
    });

    return Promise
      .all(promiseArray)
      .then(
        res => {
          const payload = formatter && typeof formatter === 'function' ? formatter(res, getState) : res;
          next({ ...rest, payload, type: SUCCESS });
          return payload || true;
        },
        error => {
          next({ ...rest, error, type: FAILURE });
          return false;
        },
      )
  }

  const getPromise: Function =
    typeof promise === 'function' ? promise : () => promise;

  return getPromise(client).then(
    res => {
      const payload = formatter && typeof formatter === 'function' ? formatter(res, getState) : res;
      next({ ...rest, payload, type: SUCCESS });
      return payload || true;
    },
    error => {
      next({ ...rest, error, type: FAILURE });
      return false;
    },
  );
};

export default promiseMiddleware;
