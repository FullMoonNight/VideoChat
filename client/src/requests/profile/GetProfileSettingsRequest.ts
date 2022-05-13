import BaseRequest from "../BaseRequest";
import {ProfileSettingsType} from "../../types/ProfileSettingsType";

interface GetSettingsResponse extends ProfileSettingsType {

}

export default class GetProfileSettingsRequest extends BaseRequest<GetSettingsResponse> {
    route: string = '/profile_settings'
}