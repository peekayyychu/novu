import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
} from '@novu/stateless';
import { BaseProvider } from '../../../base.provider';
import { WithPassthrough } from '../../../utils/types';

export class KaleyraSmsProvider extends BaseProvider implements ISmsProvider {
  id = 'Kaleyra';
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;

  constructor(private config: {}) {
    super();
  }

  async sendMessage(
    options: ISmsOptions,
    bridgeProviderData: WithPassthrough<Record<string, unknown>> = {},
  ): Promise<ISendMessageSuccessResponse> {
    const data = this.transform(bridgeProviderData, options);

    return {
      id: 'id_returned_by_provider',
      date: 'current_time',
    };
  }
}
