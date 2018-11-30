import { getString,setString,clear} from "tns-core-modules/application-settings";

export class Config {
    static apiUrl = "https://panafri.com/api/app/";
    static fcmUrl = "https://fcm.googleapis.com/fcm/send";
    static appKey = "";
    static authHeader = "";
    static fcmAuth="key=AAAA7ZOX9WA:APA91bG8KLLsn6CsdPbHCfkNR6pTHwo3-Y5razr3mFt5qEkNLSzdF3-vvnvE_0a5yYzN37qTC1i9XSCtX3qGNrHrh7HOJ0lv0iRhir9A17SwUKZFvy6SF0dWmIVImgoMoB1S1q3hqCJR";
    static token = getString("token");
    static deviceToken= getString("deviceToken")
  }