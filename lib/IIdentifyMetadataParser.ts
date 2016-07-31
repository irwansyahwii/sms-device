import Rx = require('rxjs/Rx');
import {SmsDeviceInfo} from './SmsDeviceInfo';

/**
 * Defined the operation to parse SIM card identification metadata
 */
export interface IIdentifyMetadataParser{
    /**
     * Parse an identification metadata
     * 
     * @return {Rx.Observable<SmsDeviceInfo>} An observable containing SmsDeviceInfo
     */
    parse(metadataString: string):Rx.Observable<SmsDeviceInfo>;
} 