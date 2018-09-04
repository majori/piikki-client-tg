import 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import { contextBuilder } from './helper';
import * as api from '../src/api';
import messages from '../src/constants/messages';

import saldo from '../src/commands/saldo';

describe('Commands', () => {
  let stub: sinon.SinonStub;

  afterEach(async () => {
    stub.resetHistory();
  });

  const setUserStub = (body: any) => {
    stub = sinon.stub(api, 'getUser').resolves(body);
  };

  describe('Saldo', () => {
    it('replys error message if user isn\'t member in any group', async () => {
      setUserStub({
        username: 'user',
        saldos: {},
        defaultGroup: 'group1',
      });

      const context = contextBuilder();

      await saldo(context as any);
      expect(context.reply.lastCall.calledWith(messages.notAMemberInAnyGroup)).to.be.true;
    });
  });
});
