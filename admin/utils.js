const moment = require("moment-timezone");
const {
  writeInRealtime,
} = require("../database/realtime");


const {
  code,
} = require("./responses");

const phoneUtil = require(
  "google-libphonenumber").PhoneNumberUtil.getInstance();

const {
  timeStampFirestoreX,
  timeStampRealTimeX,
} = require(".");


const missingParameterX = (
  parameterX,
) => {
  const missing = " ¶¶";

  if (parameterX.includes(missing)) {
    return true;
  } else {
    return false;
  }
};

const getThisDocument = async (
  path,
  variable = "variable",
) => {
  const {getOneDocument} = require("../database/firestore");

  let document = await getOneDocument(path);
  document.response === code.ok ?
    document = document.data:
    document = " ¶¶_" + variable;

  return document;
};

// eslint-disable-next-line require-jsdoc
async function getDataFromManyPaths(onlyPaths) {
  const {getThisDocument} = require("../../../admin/utils");
  const valuesData = {};

  const dataKeys = Object.keys(onlyPaths).sort();

  for (const dataKey of dataKeys) {
    // console.info(dataKey);
    valuesData[dataKey] = await getThisDocument(onlyPaths[dataKey], `getDataFromManyPaths.valuesData.${dataKey}`);
  }

  return Promise.resolve(valuesData);
}

const sendSnackBar = (
  messageX = " ¶¶_sendSnackBar",
  typeMessageX = "success",
  entityX = " ¶¶_entity",
  errorX = " ¶¶_error",
  dataX = " ¶¶_data",
  messageAppX = false, // Opcional
) => {
  let isErrorX = false;

  if (typeMessageX === "error") {
    isErrorX = true;
    writeInRealtime(errorX,
      "error", "byEntity/" + entityX, "error");
    if (errorX.codePrefix) {
      writeInRealtime(errorX,
        "error", "byCodePrefix/" + errorX.codePrefix + "/" + entityX, "error");
    } else {
      writeInRealtime(errorX,
        "error", "byCodePrefix/¶¶_codePrefix/" + entityX, "error");
    }
  }

  if (messageAppX) {
    return {
      isError: isErrorX,
      messageSnackBar: messageX,
      colorSnackBar: typeMessageX,
      messageApp: messageAppX,
    };
  } else if (typeMessageX === "isAvailable" || typeMessageX === "isRegistered" ) {
    return {
      isError: isErrorX,
      messageSnackBar: messageX,
      colorSnackBar: errorX,
      [typeMessageX]: dataX,
    };
  } else {
    return {
      isError: isErrorX,
      messageSnackBar: messageX,
      colorSnackBar: typeMessageX,
    };
  }
};

/**
 * Verifies a phone number based on the E.164 standard.
 *
 * @param {string} phoneNumber A phone number.
 * @return {boolean} If the string is a *valid* __E.164__ phone number.
 * @see https://en.wikipedia.org/wiki/E.164
 */
const isE164PhoneNumber = (phoneNumber) => {
  if (typeof phoneNumber !== "string" ||
    phoneNumber.trim() !== phoneNumber ||
    phoneNumber.replace(/ +/g, "") !== phoneNumber) {
    return false;
  }

  try {
    const parsedPhoneNumberObject = phoneUtil.parseAndKeepRawInput(phoneNumber);
    return phoneUtil.isPossibleNumber(parsedPhoneNumberObject);
  } catch (error) {
    /**
       * Error was thrown by the library. i.e., the phone number is invalid
       */
    return false;
  }
};

const obfuscatedEmailX = (eMailX) => {
  if (eMailX) {
    eMailX = eMailX.split("@");
    const emailName = `${eMailX[0].substring(0, 3)}*****`;
    const emailDomain = eMailX[1].split(".");
    emailDomain[0] = `${emailDomain[0].substring(0, 3)}*****`;
    return `${emailName}@${emailDomain[0]}.${emailDomain[1]}`;
  } else {
    return undefined;
  }
};

const obfuscatedPhoneNumberX = (phoneNumberX) => {
  if (phoneNumberX) {
    return `${phoneNumberX.substring(3, 6)} *** **${phoneNumberX.slice(-2)}`;
  } else {
    return undefined;
  }
};


const obfuscatedUidX = (uid) => {
  if (uid) {
    return `${uid.substring(3, 6)}******${uid.slice(-2)}`;
  } else {
    return undefined;
  }
};

const isValidTimezone = (timezone) => timezonesSet.has(timezone);

moment.locale("es_CO"); // HARDCODE
const nowX = moment(timeStampFirestoreX).tz("America/Bogota"); // HARDCODE
const nowXrt = moment(timeStampRealTimeX).tz("America/Bogota"); // HARDCODE
const weekDayX = nowX.day();
const dayX = nowX.format("DD");
const hourX = nowX.format("HH");
const minuteX = nowX.format("mm");
const secondsX = nowX.format("ss");
const monthX = nowX.format("MM");
const yearX = nowX.format("YYYY");
const textMonthX = nowX.format("MMMM");
const textWeekDayX = nowX.format("dddd");

const dateDian = (dateX, timeZone ="America/Bogota") => {
  const date = moment(dateX.seconds * 1000).tz(timeZone);
  return date.format("YYYY-MM-DD");
};

const timeDian = (hourX, timeZone ="America/Bogota") => {
  const hour = moment(hourX.seconds * 1000).tz(timeZone);
  return hour.format("HH:mm:ssZ");
};

const amountDian = (amount = 0.00, name = "amountDian") => {
  if (amount >= 0.00) {
    return amount.toFixed(2);
  } else {
    return " ¶¶" + name + " (" + amount + ")";
  }
};


const timezonesSet = new Set()
  .add("Africa/Abidjan")
  .add("Africa/Accra")
  .add("Africa/Addis_Ababa")
  .add("Africa/Algiers")
  .add("Africa/Asmara")
  .add("Africa/Asmera")
  .add("Africa/Bamako")
  .add("Africa/Bangui")
  .add("Africa/Banjul")
  .add("Africa/Bissau")
  .add("Africa/Blantyre")
  .add("Africa/Brazzaville")
  .add("Africa/Bujumbura")
  .add("Africa/Cairo")
  .add("Africa/Casablanca")
  .add("Africa/Ceuta")
  .add("Africa/Conakry")
  .add("Africa/Dakar")
  .add("Africa/Dar_es_Salaam")
  .add("Africa/Djibouti")
  .add("Africa/Douala")
  .add("Africa/El_Aaiun")
  .add("Africa/Freetown")
  .add("Africa/Gaborone")
  .add("Africa/Harare")
  .add("Africa/Johannesburg")
  .add("Africa/Juba")
  .add("Africa/Kampala")
  .add("Africa/Khartoum")
  .add("Africa/Kigali")
  .add("Africa/Kinshasa")
  .add("Africa/Lagos")
  .add("Africa/Libreville")
  .add("Africa/Lome")
  .add("Africa/Luanda")
  .add("Africa/Lubumbashi")
  .add("Africa/Lusaka")
  .add("Africa/Malabo")
  .add("Africa/Maputo")
  .add("Africa/Maseru")
  .add("Africa/Mbabane")
  .add("Africa/Mogadishu")
  .add("Africa/Monrovia")
  .add("Africa/Nairobi")
  .add("Africa/Ndjamena")
  .add("Africa/Niamey")
  .add("Africa/Nouakchott")
  .add("Africa/Ouagadougou")
  .add("Africa/Porto-Novo")
  .add("Africa/Sao_Tome")
  .add("Africa/Timbuktu")
  .add("Africa/Tripoli")
  .add("Africa/Tunis")
  .add("Africa/Windhoek")
  .add("America/Adak")
  .add("America/Anchorage")
  .add("America/Anguilla")
  .add("America/Antigua")
  .add("America/Araguaina")
  .add("America/Argentina/Buenos_Aires")
  .add("America/Argentina/Catamarca")
  .add("America/Argentina/ComodRivadavia")
  .add("America/Argentina/Cordoba")
  .add("America/Argentina/Jujuy")
  .add("America/Argentina/La_Rioja")
  .add("America/Argentina/Mendoza")
  .add("America/Argentina/Rio_Gallegos")
  .add("America/Argentina/Salta")
  .add("America/Argentina/San_Juan")
  .add("America/Argentina/San_Luis")
  .add("America/Argentina/Tucuman")
  .add("America/Argentina/Ushuaia")
  .add("America/Aruba")
  .add("America/Asuncion")
  .add("America/Atikokan")
  .add("America/Atka")
  .add("America/Bahia")
  .add("America/Bahia_Banderas")
  .add("America/Barbados")
  .add("America/Belem")
  .add("America/Belize")
  .add("America/Blanc-Sablon")
  .add("America/Boa_Vista")
  .add("America/Bogota")
  .add("America/Boise")
  .add("America/Buenos_Aires")
  .add("America/Cambridge_Bay")
  .add("America/Campo_Grande")
  .add("America/Cancun")
  .add("America/Caracas")
  .add("America/Catamarca")
  .add("America/Cayenne")
  .add("America/Cayman")
  .add("America/Chicago")
  .add("America/Chihuahua")
  .add("America/Coral_Harbour")
  .add("America/Cordoba")
  .add("America/Costa_Rica")
  .add("America/Creston")
  .add("America/Cuiaba")
  .add("America/Curacao")
  .add("America/Danmarkshavn")
  .add("America/Dawson")
  .add("America/Dawson_Creek")
  .add("America/Denver")
  .add("America/Detroit")
  .add("America/Dominica")
  .add("America/Edmonton")
  .add("America/Eirunepe")
  .add("America/El_Salvador")
  .add("America/Ensenada")
  .add("America/Fort_Nelson")
  .add("America/Fort_Wayne")
  .add("America/Fortaleza")
  .add("America/Glace_Bay")
  .add("America/Godthab")
  .add("America/Goose_Bay")
  .add("America/Grand_Turk")
  .add("America/Grenada")
  .add("America/Guadeloupe")
  .add("America/Guatemala")
  .add("America/Guayaquil")
  .add("America/Guyana")
  .add("America/Halifax")
  .add("America/Havana")
  .add("America/Hermosillo")
  .add("America/Indiana/Indianapolis")
  .add("America/Indiana/Knox")
  .add("America/Indiana/Marengo")
  .add("America/Indiana/Petersburg")
  .add("America/Indiana/Tell_City")
  .add("America/Indiana/Vevay")
  .add("America/Indiana/Vincennes")
  .add("America/Indiana/Winamac")
  .add("America/Indianapolis")
  .add("America/Inuvik")
  .add("America/Iqaluit")
  .add("America/Jamaica")
  .add("America/Jujuy")
  .add("America/Juneau")
  .add("America/Kentucky/Louisville")
  .add("America/Kentucky/Monticello")
  .add("America/Knox_IN")
  .add("America/Kralendijk")
  .add("America/La_Paz")
  .add("America/Lima")
  .add("America/Los_Angeles")
  .add("America/Louisville")
  .add("America/Lower_Princes")
  .add("America/Maceio")
  .add("America/Managua")
  .add("America/Manaus")
  .add("America/Marigot")
  .add("America/Martinique")
  .add("America/Matamoros")
  .add("America/Mazatlan")
  .add("America/Mendoza")
  .add("America/Menominee")
  .add("America/Merida")
  .add("America/Metlakatla")
  .add("America/Mexico_City")
  .add("America/Miquelon")
  .add("America/Moncton")
  .add("America/Monterrey")
  .add("America/Montevideo")
  .add("America/Montreal")
  .add("America/Montserrat")
  .add("America/Nassau")
  .add("America/New_York")
  .add("America/Nipigon")
  .add("America/Nome")
  .add("America/Noronha")
  .add("America/North_Dakota/Beulah")
  .add("America/North_Dakota/Center")
  .add("America/North_Dakota/New_Salem")
  .add("America/Ojinaga")
  .add("America/Panama")
  .add("America/Pangnirtung")
  .add("America/Paramaribo")
  .add("America/Phoenix")
  .add("America/Port-au-Prince")
  .add("America/Port_of_Spain")
  .add("America/Porto_Acre")
  .add("America/Porto_Velho")
  .add("America/Puerto_Rico")
  .add("America/Punta_Arenas")
  .add("America/Rainy_River")
  .add("America/Rankin_Inlet")
  .add("America/Recife")
  .add("America/Regina")
  .add("America/Resolute")
  .add("America/Rio_Branco")
  .add("America/Rosario")
  .add("America/Santa_Isabel")
  .add("America/Santarem")
  .add("America/Santiago")
  .add("America/Santo_Domingo")
  .add("America/Sao_Paulo")
  .add("America/Scoresbysund")
  .add("America/Shiprock")
  .add("America/Sitka")
  .add("America/St_Barthelemy")
  .add("America/St_Johns")
  .add("America/St_Kitts")
  .add("America/St_Lucia")
  .add("America/St_Thomas")
  .add("America/St_Vincent")
  .add("America/Swift_Current")
  .add("America/Tegucigalpa")
  .add("America/Thule")
  .add("America/Thunder_Bay")
  .add("America/Tijuana")
  .add("America/Toronto")
  .add("America/Tortola")
  .add("America/Vancouver")
  .add("America/Virgin")
  .add("America/Whitehorse")
  .add("America/Winnipeg")
  .add("America/Yakutat")
  .add("America/Yellowknife")
  .add("Antarctica/Casey")
  .add("Antarctica/Davis")
  .add("Antarctica/DumontDUrville")
  .add("Antarctica/Macquarie")
  .add("Antarctica/Mawson")
  .add("Antarctica/McMurdo")
  .add("Antarctica/Palmer")
  .add("Antarctica/Rothera")
  .add("Antarctica/South_Pole")
  .add("Antarctica/Syowa")
  .add("Antarctica/Troll")
  .add("Antarctica/Vostok")
  .add("Arctic/Longyearbyen")
  .add("Asia/Aden")
  .add("Asia/Almaty")
  .add("Asia/Amman")
  .add("Asia/Anadyr")
  .add("Asia/Aqtau")
  .add("Asia/Aqtobe")
  .add("Asia/Ashgabat")
  .add("Asia/Ashkhabad")
  .add("Asia/Atyrau")
  .add("Asia/Baghdad")
  .add("Asia/Bahrain")
  .add("Asia/Baku")
  .add("Asia/Bangkok")
  .add("Asia/Barnaul")
  .add("Asia/Beirut")
  .add("Asia/Bishkek")
  .add("Asia/Brunei")
  .add("Asia/Calcutta")
  .add("Asia/Chita")
  .add("Asia/Choibalsan")
  .add("Asia/Chongqing")
  .add("Asia/Chungking")
  .add("Asia/Colombo")
  .add("Asia/Dacca")
  .add("Asia/Damascus")
  .add("Asia/Dhaka")
  .add("Asia/Dili")
  .add("Asia/Dubai")
  .add("Asia/Dushanbe")
  .add("Asia/Famagusta")
  .add("Asia/Gaza")
  .add("Asia/Harbin")
  .add("Asia/Hebron")
  .add("Asia/Ho_Chi_Minh")
  .add("Asia/Hong_Kong")
  .add("Asia/Hovd")
  .add("Asia/Irkutsk")
  .add("Asia/Istanbul")
  .add("Asia/Jakarta")
  .add("Asia/Jayapura")
  .add("Asia/Jerusalem")
  .add("Asia/Kabul")
  .add("Asia/Kamchatka")
  .add("Asia/Karachi")
  .add("Asia/Kashgar")
  .add("Asia/Kathmandu")
  .add("Asia/Katmandu")
  .add("Asia/Khandyga")
  .add("Asia/Kolkata")
  .add("Asia/Krasnoyarsk")
  .add("Asia/Kuala_Lumpur")
  .add("Asia/Kuching")
  .add("Asia/Kuwait")
  .add("Asia/Macao")
  .add("Asia/Macau")
  .add("Asia/Magadan")
  .add("Asia/Makassar")
  .add("Asia/Manila")
  .add("Asia/Muscat")
  .add("Asia/Nicosia")
  .add("Asia/Novokuznetsk")
  .add("Asia/Novosibirsk")
  .add("Asia/Omsk")
  .add("Asia/Oral")
  .add("Asia/Phnom_Penh")
  .add("Asia/Pontianak")
  .add("Asia/Pyongyang")
  .add("Asia/Qatar")
  .add("Asia/Qyzylorda")
  .add("Asia/Rangoon")
  .add("Asia/Riyadh")
  .add("Asia/Saigon")
  .add("Asia/Sakhalin")
  .add("Asia/Samarkand")
  .add("Asia/Seoul")
  .add("Asia/Shanghai")
  .add("Asia/Singapore")
  .add("Asia/Srednekolymsk")
  .add("Asia/Taipei")
  .add("Asia/Tashkent")
  .add("Asia/Tbilisi")
  .add("Asia/Tehran")
  .add("Asia/Tel_Aviv")
  .add("Asia/Thimbu")
  .add("Asia/Thimphu")
  .add("Asia/Tokyo")
  .add("Asia/Tomsk")
  .add("Asia/Ujung_Pandang")
  .add("Asia/Ulaanbaatar")
  .add("Asia/Ulan_Bator")
  .add("Asia/Urumqi")
  .add("Asia/Ust-Nera")
  .add("Asia/Vientiane")
  .add("Asia/Vladivostok")
  .add("Asia/Yakutsk")
  .add("Asia/Yangon")
  .add("Asia/Yekaterinburg")
  .add("Asia/Yerevan")
  .add("Atlantic/Azores")
  .add("Atlantic/Bermuda")
  .add("Atlantic/Canary")
  .add("Atlantic/Cape_Verde")
  .add("Atlantic/Faeroe")
  .add("Atlantic/Faroe")
  .add("Atlantic/Jan_Mayen")
  .add("Atlantic/Madeira")
  .add("Atlantic/Reykjavik")
  .add("Atlantic/South_Georgia")
  .add("Atlantic/St_Helena")
  .add("Atlantic/Stanley")
  .add("Australia/ACT")
  .add("Australia/Adelaide")
  .add("Australia/Brisbane")
  .add("Australia/Broken_Hill")
  .add("Australia/Canberra")
  .add("Australia/Currie")
  .add("Australia/Darwin")
  .add("Australia/Eucla")
  .add("Australia/Hobart")
  .add("Australia/LHI")
  .add("Australia/Lindeman")
  .add("Australia/Lord_Howe")
  .add("Australia/Melbourne")
  .add("Australia/NSW")
  .add("Australia/North")
  .add("Australia/Perth")
  .add("Australia/Queensland")
  .add("Australia/South")
  .add("Australia/Sydney")
  .add("Australia/Tasmania")
  .add("Australia/Victoria")
  .add("Australia/West")
  .add("Australia/Yancowinna")
  .add("Brazil/Acre")
  .add("Brazil/DeNoronha")
  .add("Brazil/East")
  .add("Brazil/West")
  .add("CET")
  .add("CST6CDT")
  .add("Canada/Atlantic")
  .add("Canada/Central")
  .add("Canada/Eastern")
  .add("Canada/Mountain")
  .add("Canada/Newfoundland")
  .add("Canada/Pacific")
  .add("Canada/Saskatchewan")
  .add("Canada/Yukon")
  .add("Chile/Continental")
  .add("Chile/EasterIsland")
  .add("Cuba")
  .add("EET")
  .add("EST")
  .add("EST5EDT")
  .add("Egypt")
  .add("Eire")
  .add("Etc/GMT")
  .add("Etc/GMT-0")
  .add("Etc/GMT-1")
  .add("Etc/GMT-2")
  .add("Etc/GMT-3")
  .add("Etc/GMT-4")
  .add("Etc/GMT-5")
  .add("Etc/GMT-6")
  .add("Etc/GMT-7")
  .add("Etc/GMT-8")
  .add("Etc/GMT-9")
  .add("Etc/GMT-10")
  .add("Etc/GMT-11")
  .add("Etc/GMT-12")
  .add("Etc/GMT-13")
  .add("Etc/GMT-14")
  .add("Etc/GMT+0")
  .add("Etc/GMT+1")
  .add("Etc/GMT+2")
  .add("Etc/GMT+4")
  .add("Etc/GMT+3")
  .add("Etc/GMT+5")
  .add("Etc/GMT+6")
  .add("Etc/GMT+7")
  .add("Etc/GMT+8")
  .add("Etc/GMT+9")
  .add("Etc/GMT+10")
  .add("Etc/GMT+11")
  .add("Etc/GMT+12")
  .add("Etc/GMT0")
  .add("Etc/Greenwich")
  .add("Etc/UCT")
  .add("Etc/UTC")
  .add("Etc/Universal")
  .add("Etc/Zulu")
  .add("Europe/Amsterdam")
  .add("Europe/Andorra")
  .add("Europe/Astrakhan")
  .add("Europe/Athens")
  .add("Europe/Belfast")
  .add("Europe/Belgrade")
  .add("Europe/Berlin")
  .add("Europe/Bratislava")
  .add("Europe/Brussels")
  .add("Europe/Bucharest")
  .add("Europe/Budapest")
  .add("Europe/Busingen")
  .add("Europe/Chisinau")
  .add("Europe/Copenhagen")
  .add("Europe/Dublin")
  .add("Europe/Gibraltar")
  .add("Europe/Guernsey")
  .add("Europe/Helsinki")
  .add("Europe/Isle_of_Man")
  .add("Europe/Istanbul")
  .add("Europe/Jersey")
  .add("Europe/Kaliningrad")
  .add("Europe/Kiev")
  .add("Europe/Kirov")
  .add("Europe/Lisbon")
  .add("Europe/Ljubljana")
  .add("Europe/London")
  .add("Europe/Luxembourg")
  .add("Europe/Madrid")
  .add("Europe/Malta")
  .add("Europe/Mariehamn")
  .add("Europe/Minsk")
  .add("Europe/Monaco")
  .add("Europe/Moscow")
  .add("Europe/Nicosia")
  .add("Europe/Oslo")
  .add("Europe/Paris")
  .add("Europe/Podgorica")
  .add("Europe/Prague")
  .add("Europe/Riga")
  .add("Europe/Rome")
  .add("Europe/Samara")
  .add("Europe/San_Marino")
  .add("Europe/Sarajevo")
  .add("Europe/Saratov")
  .add("Europe/Simferopol")
  .add("Europe/Skopje")
  .add("Europe/Sofia")
  .add("Europe/Stockholm")
  .add("Europe/Tallinn")
  .add("Europe/Tirane")
  .add("Europe/Tiraspol")
  .add("Europe/Ulyanovsk")
  .add("Europe/Uzhgorod")
  .add("Europe/Vaduz")
  .add("Europe/Vatican")
  .add("Europe/Vienna")
  .add("Europe/Vilnius")
  .add("Europe/Volgograd")
  .add("Europe/Warsaw")
  .add("Europe/Zagreb")
  .add("Europe/Zaporozhye")
  .add("Europe/Zurich")
  .add("GB")
  .add("GB-Eire")
  .add("GMT")
  .add("GMT+0")
  .add("GMT-0")
  .add("GMT0")
  .add("Greenwich")
  .add("HST")
  .add("Hongkong")
  .add("Iceland")
  .add("Indian/Antananarivo")
  .add("Indian/Chagos")
  .add("Indian/Christmas")
  .add("Indian/Cocos")
  .add("Indian/Comoro")
  .add("Indian/Kerguelen")
  .add("Indian/Mahe")
  .add("Indian/Maldives")
  .add("Indian/Mauritius")
  .add("Indian/Mayotte")
  .add("Indian/Reunion")
  .add("Iran")
  .add("Israel")
  .add("Jamaica")
  .add("Japan")
  .add("Kwajalein")
  .add("Libya")
  .add("MET")
  .add("MST")
  .add("MST7MDT")
  .add("Mexico/BajaNorte")
  .add("Mexico/BajaSur")
  .add("Mexico/General")
  .add("NZ")
  .add("NZ-CHAT")
  .add("Navajo")
  .add("PRC")
  .add("PST8PDT")
  .add("Pacific/Apia")
  .add("Pacific/Auckland")
  .add("Pacific/Bougainville")
  .add("Pacific/Chatham")
  .add("Pacific/Chuuk")
  .add("Pacific/Easter")
  .add("Pacific/Efate")
  .add("Pacific/Enderbury")
  .add("Pacific/Fakaofo")
  .add("Pacific/Fiji")
  .add("Pacific/Funafuti")
  .add("Pacific/Galapagos")
  .add("Pacific/Gambier")
  .add("Pacific/Guadalcanal")
  .add("Pacific/Guam")
  .add("Pacific/Honolulu")
  .add("Pacific/Johnston")
  .add("Pacific/Kiritimati")
  .add("Pacific/Kosrae")
  .add("Pacific/Kwajalein")
  .add("Pacific/Majuro")
  .add("Pacific/Marquesas")
  .add("Pacific/Midway")
  .add("Pacific/Nauru")
  .add("Pacific/Niue")
  .add("Pacific/Norfolk")
  .add("Pacific/Noumea")
  .add("Pacific/Pago_Pago")
  .add("Pacific/Palau")
  .add("Pacific/Pitcairn")
  .add("Pacific/Pohnpei")
  .add("Pacific/Ponape")
  .add("Pacific/Port_Moresby")
  .add("Pacific/Rarotonga")
  .add("Pacific/Saipan")
  .add("Pacific/Samoa")
  .add("Pacific/Tahiti")
  .add("Pacific/Tarawa")
  .add("Pacific/Tongatapu")
  .add("Pacific/Truk")
  .add("Pacific/Wake")
  .add("Pacific/Wallis")
  .add("Pacific/Yap")
  .add("Poland")
  .add("Portugal")
  .add("ROC")
  .add("ROK")
  .add("Singapore")
  .add("Turkey")
  .add("UCT")
  .add("US/Alaska")
  .add("US/Aleutian")
  .add("US/Arizona")
  .add("US/Central")
  .add("US/East-Indiana")
  .add("US/Eastern")
  .add("US/Hawaii")
  .add("US/Indiana-Starke")
  .add("US/Michigan")
  .add("US/Mountain")
  .add("US/Pacific")
  .add("US/Pacific-New")
  .add("US/Samoa")
  .add("UTC")
  .add("Universal")
  .add("W-SU")
  .add("WET")
  .add("Zulu");

/**
 * Ends the response of the request after successful completion of the task
 * or on an error.
 *
 * @param {Object} conn Object containing Express's Request and Response objects.
 * @param {number} statusCode A standard HTTP status code.
 * @param {string} [message] Response message for the request.
 * @return {void}
 */
const sendResponse = (conn, statusCode = code.ok, message = "") => {
  conn.res.writeHead(statusCode, conn.headers);

  /** 2xx codes denote success. */
  const success = statusCode <= 226;

  /**
   * Requests from sendGrid are retried whenever the status
   * code is 4xx or 5xx. We are explicitly avoiding this.
   */
  // if (conn.req.query.token === env.sgMailParseToken) {
  conn.res.writeHead(code.ok, conn.headers);
  // }

  if (!success) {
    console.log(JSON.stringify({
      ip: conn.req.ip,
      header: conn.req.headers,
      url: conn.req.url,
      body: conn.req.body,
      requester: conn.requester,
    }));
  }

  conn.res.end(JSON.stringify({
    message,
    success,
    code: statusCode,
  }));
};

/**
  * ⚠️ Stop the event pool.
  * @param {number} milliseconds
  * @return {Promise} Continue event pool
  */
function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}


/**
  * How many times a character appears in a string.
  * @param {string} string
  * @param {string} character
  * @return {number} The times a character appears in a string.
  */
function howOften(string = "string", character = "_") {
  const often = [];
  for (let i = 0; i < string.length; i++) {
    if (string[i].toLowerCase() === character) often.push(i);
  }
  return often.length;
}


/**
  * Return json with tipical item id values, include gDrive id.
  * @param {string} itemId with 2 character "_" appears in a string.
  * @param {string} mTenant
  * @return {json} The Item Id Values or {}.
  */
function getItemIdValues(itemId = "string", mTenant = "tufactura.com") {
  const {tenant} = require("./hardCodeTenants");
  const tenantX = tenant(mTenant); // HARDCODE debe ser automático el tenant
  const itemIdValues = {};


  if (howOften(itemId, "_") === 2) {
    // itemId = ENTITY_TYPE_CONSECUTIVE
    itemIdValues.itemId = itemId;
    itemIdValues.itemIdArray = (itemId).split("_");
    itemIdValues.entity = itemIdValues.itemIdArray[0];
    itemIdValues.type = itemIdValues.itemIdArray[1];
    itemIdValues.documentNumber = itemIdValues.itemIdArray[2];
    // itemIdValues.documentPrefix = itemIdValues.itemIdArray[2].split("-")[0];
    // itemIdValues.documentConsecutive = itemIdValues.itemIdArray[2].split("-")[1];

    // Store in folder based on document type (HARDCODE: tenant domain presets).
    itemIdValues.documentId = itemIdValues.type + "_" + itemIdValues.documentNumber;
    itemIdValues.parentFolder = tenantX.drive.type[itemIdValues.type];
    itemIdValues.typeName = tenantX.drive.typeName[itemIdValues.type];
    itemIdValues.parentFolderRef = `/entities/${itemIdValues.entity}/drive/${itemIdValues.parentFolder}`;
    itemIdValues.gDriveRef = `/entities/${itemIdValues.entity}/drive/${itemIdValues.documentId}`; // Firestore - Google Drive Objects ID
    itemIdValues.originRef = `/entities/${itemIdValues.entity}/${itemIdValues.parentFolder}/${itemIdValues.documentId}`;
  }
  return itemIdValues;
}

const sortObject = (objectData) =>{
  // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/Funci%C3%B3n-sortObject-con-recursividad
  const arrayKeys = [];

  JSON.stringify(objectData, (key, value) => {
    arrayKeys.push(key);
    return value;
  });

  arrayKeys.sort();
  return JSON.parse(JSON.stringify(objectData, arrayKeys));
};

const generateRandomString = (num) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < num; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


const interpolateString = (
  template,
  data = {},
) => {
  let jsonTemplate = JSON.stringify(template);

  for (const key in data) {
    if (data[key]) {
      const value = data[key];
      jsonTemplate = jsonTemplate.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
  }
  return JSON.parse(jsonTemplate);
};

const interpolateManyStrings = (
  template,
  data = {},
) => {
  // console.log("¶¶¶ interpolateString", template);
  let jsonTemplate = JSON.stringify(template);

  for (const key in data) {
    if (data[key]) {
      const value = data[key];
      jsonTemplate = jsonTemplate.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
  }
  // console.log("¶¶ ¶¶ jsonTemplate", jsonTemplate);
  return JSON.parse(jsonTemplate);
};


// Filtrar todas las propiedades que tienen el mismo texto en un json
const filterKeysInObject = (json, textValue) => {
  const array = [];
  for (const key in json) {
    if (json[key].toLowerCase() === textValue.toLowerCase()) {
      array.push(key);
    }
  }
  // console.log("filterKeysInObject", array);
  return array;
};


// Filtrar objetos en un array con wildcards sin tener en cuenta mayúsculas y minúsculas ni las tildes.
const filterObjectInArray = (array, key, value) => {
  const arrayFiltered = [];
  try {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
        arrayFiltered.push(array[i]);
      }
    }


    return arrayFiltered;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};


// Funciones para determinar si entity es contador o cliente
const rut = require("../data/rut.json");


const getEmailFromDian = (nitEntity) => {
  // const rut = require("../data/rut.json");
  return rut[nitEntity] || false;
};


const getNITsFromDian = (eMailEntity) => {
  // const rut = require("../data/rut.json");
  return filterKeysInObject(rut, eMailEntity);
};


const isAccountant = (entity, getArray = false) => {
  const nitArray = getNITsFromDian(getEmailFromDian(entity));
  console.log("isAccountant nitArray", nitArray);

  if (getArray === true) {
    return nitArray.length > 1 ? nitArray : false;
  } else {
    return nitArray.length > 1 ? true : false;
  }
};


module.exports = {
  nowX,
  dayX,
  yearX,
  sleep,
  hourX,
  monthX,
  nowXrt,
  minuteX,
  secondsX,
  weekDayX,
  howOften,
  dateDian,
  timeDian,
  amountDian,
  textMonthX,
  sortObject,
  sendSnackBar,
  isAccountant,
  textWeekDayX,
  sendResponse,
  obfuscatedUidX,
  getThisDocument,
  isValidTimezone,
  getItemIdValues,
  getNITsFromDian,
  getEmailFromDian,
  obfuscatedEmailX,
  isE164PhoneNumber,
  interpolateString,
  missingParameterX,
  filterKeysInObject,
  filterObjectInArray,
  getDataFromManyPaths,
  generateRandomString,
  interpolateManyStrings,
  obfuscatedPhoneNumberX,
};

