import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "/Users/lfeldblum/Oren/Oren_Herbalist_Site/outputs/oren_outreach_contacts_2026_10_29";
const outputPath = `${outputDir}/oren_herbalist_outreach_contacts.xlsx`;
const checked = new Date("2026-10-29T00:00:00+02:00");

const leads = [];
const add = (priority, category, organization, program, area, coverage, contact, email, phone, route, fit, opening, website, source, sourceType = "Official website", verification = "Public organizational contact published online; verify role when contacting.", status = "Not contacted", notes = "") => {
  leads.push([priority, category, organization, program, area, coverage, contact, email, phone, route, fit, opening, website, source, sourceType, checked, verification, status, null, "Send a short introduction and ask for a 15-minute call", notes]);
};

// Mechinot and national educational programs
add("A", "Mechina / umbrella", "מועצת המכינות הקדם-צבאיות", "National council", "Nationwide", "Nationwide", "Council office / educational partnerships", "info@mechinot.org.il", "04-9838753 ext. 212; 054-8097433", "Connector", "One introduction can reach many pre-military academies.", "Ask to circulate a one-page workshop menu to program directors.", "https://mechinot.org.il", "https://mechinot.org.il/images/galleries/hadracha_2021/%D7%97%D7%95%D7%91%D7%A8%D7%AA_%D7%9E%D7%99%D7%93%D7%A2_%D7%A2%D7%9C_%D7%94%D7%93%D7%A8%D7%9B%D7%94_%D7%91%D7%9E%D7%9B%D7%99%D7%A0%D7%95%D7%AA_%D7%AA%D7%A9%D7%A4%D7%90_21.pdf", "Council publication");
add("A", "Mechina", "מכינת גליל עליון", "Four northern branches", "Upper Galilee", "North", "Main office", "info@mgalil.org", "050-5956606", "Direct booker", "Large northern program with several cohorts and strong place-based education.", "Offer a seasonal foraging and natural first-aid salve workshop.", "https://galil-leadership.org", "https://www.jgive.com/new/he/ils/charity-organizations/275", "Verified nonprofit profile");
add("A", "Mechina", "מכינת ימין אורד", "Hatzor HaGlilit", "Hatzor HaGlilit", "North", "Nurit – information and registration", "nurit@derechkfar.org.il", "050-7556823; 04-6860806", "Direct booker", "Residential leadership program in the north; direct named contact.", "Suggest a practical nature workshop built around resilience and group work.", "https://mechina-yeminorde.co.il", "https://mechina-yeminorde.co.il/%D7%99%D7%A6%D7%99%D7%A8%D7%AA-%D7%A7%D7%A9%D7%A8/", "Official website");
add("A", "Mechina", "מדרשת תבור", "Mechinat Tavor branches", "Nof HaGalil / Kiryat Shmona / North", "North", "Sagit Morad – office manager", "Info@tavor.org.il", "04-6451225; 052-6027800", "Direct booker", "Multiple northern branches and experiential leadership programming.", "Offer a rotating workshop for each branch or a staff-and-cadets day.", "https://www.tavor.org.il", "https://www.tavor.org.il/contact", "Official website");
add("A", "Mechina", "מכינת חנתון", "Hanaton Educational Center", "Kibbutz Hanaton", "North", "Mechina office / educational center", "echannaton@echannaton.org", "04-9059605", "Direct booker", "Inclusive residential academy with experiential, community-based education.", "Lead with an accessible sensory herbal workshop and local plant knowledge.", "https://echannaton.org/programs/pre-military/", "https://echannaton.org/contact/", "Official website");
add("A", "Mechina", "מכינת מיצר", "Meitzar", "Southern Golan", "North", "Mechina office", "", "04-6763760; 055-6673003", "Direct booker", "Strong environmental and place-based values; excellent fit for foraging.", "Offer seasonal plant identification, responsible gathering, and preparation.", "http://www.meitzar.org.il", "https://mechinot.org.il/mechina/phonebook/46-klaliot/61-meitzar/139-office-meitzar", "Official council directory");
add("A", "Mechina", "מכינת העמ\"ק", "Kfar Ruppin", "Beit Shean Valley", "North", "Administration", "minhal@chivruta.org", "04-6060704", "Direct booker", "Residential group in a rural valley setting; workshops can support group life and enrichment.", "Pitch a hands-on local herbs workshop plus a take-home product.", "https://chivruta.org/%D7%9E%D7%9B%D7%99%D7%A0%D7%AA-%D7%94%D7%A2%D7%9E%D7%A7/", "https://www.sng.org.il/uploads/n/1609848873.4660.pdf", "Public program directory", "Contact was published in a 2020 program guide; call first to confirm.");
add("A", "Mechina", "מכינת חביבה רייק", "Givat Haviva", "Menashe", "North", "Recruitment coordinator / office", "haviva.giusim@gmail.com", "055-9909587; 054-3905135", "Direct booker", "The program already teaches sustainability and connection to land.", "Frame the workshop as practical ecology, sensory learning, and group leadership.", "https://maharyear.wixsite.com/mechina", "https://maharyear.wixsite.com/mechina/blank-2", "Official program site");
add("A", "Mechina", "מכינת גל", "Acre branch", "Acre", "North", "Maya Evron – branch director", "", "054-6454593", "Direct booker", "Direct branch leader; urban cohort can benefit from a nature-based break.", "Offer an on-site herbal preparation workshop or nearby nature outing.", "https://mechinot.org.il/mechina/phonebook/46-klaliot/57-gal", "https://mechinot.org.il/mechina/phonebook/46-klaliot/57-gal", "Official council directory");
add("A", "Mechina", "מכינת גל", "Haifa branch", "Haifa", "North", "Bar Tunian – branch director", "", "052-7046935", "Direct booker", "Direct branch leader with authority over local programming.", "Offer an on-campus sensory workshop with an optional Carmel outing.", "https://mechinot.org.il/mechina/phonebook/46-klaliot/57-gal", "https://mechinot.org.il/mechina/phonebook/46-klaliot/57-gal", "Official council directory");
add("A", "Mechina", "מכינת גל", "Netua branch", "Netua / Western Galilee", "North", "Tzvika Kanot – branch director", "", "052-9465320", "Direct booker", "Rural Western Galilee location is especially suitable for local plant workshops.", "Lead with seasonal foraging and responsible harvesting.", "https://mechinot.org.il/mechina/phonebook/46-klaliot/57-gal", "https://mechinot.org.il/mechina/phonebook/46-klaliot/57-gal", "Official council directory");
add("A", "Mechina", "מכינת אבנר עכו", "Acre", "Acre", "North", "Sarah / office", "sarah@avnerakko.co.il", "04-6319535; 050-5791782", "Direct booker", "Named office contact and a northern residential educational group.", "Suggest a workshop connecting local plants, identity, and shared making.", "https://www.avnerakko.co.il", "https://www.avnerakko.co.il/contact.html", "Official website");
add("B", "Mechina", "מכינת הנגב", "Midreshet Ben-Gurion", "Sde Boker", "Nationwide", "Mechina office", "info@magal-negev.org", "08-6532702", "Direct booker", "Strong outdoor and experiential orientation; distance makes it a special-event lead.", "Offer desert medicinal plants or a multi-workshop seminar day.", "http://www.magal-negev-israel.org", "https://www.sng.org.il/uploads/n/1609848873.4660.pdf", "Public program directory", "Contact was published in a 2020 program guide; call first to confirm.");
add("B", "Mechina", "מכינת ערבה", "Hatzava branch", "Central Arava", "Nationwide", "Branch office", "", "08-9976977; 08-9976966", "Direct booker", "Place-based environmental education and agricultural life are a close conceptual fit.", "Propose a desert plant workshop coordinated with the seasonal field program.", "https://www.aravaspirit.org.il", "https://fliphtml5.com/dppgy/exwv/%D7%97%D7%95%D7%91%D7%A8%D7%AA_-%D7%A9%D7%A0%D7%AA_%D7%A9%D7%99%D7%A8%D7%95%D7%AA_%D7%95%D7%9E%D7%9B%D7%99%D7%A0%D7%95%D7%AA/65/", "Program guide", "Published in a 2023 program guide; verify before outreach.");
add("B", "Mechina", "מכינת מלח הארץ", "Ein Gedi / Metzoke Shalem", "Dead Sea", "Nationwide", "Main office", "Melach.Aretz@Gmail.com", "08-6594534", "Direct booker", "Nature, environment, group life, and practical learning are central to the program.", "Offer a desert-adapted herb workshop or natural preparation session.", "https://melach.org.il", "https://melach.org.il/%D7%A6%D7%A8%D7%95-%D7%A7%D7%A9%D7%A8/", "Official website");
add("B", "Mechina", "עין פרת", "Leadership academies", "Kfar Adumim and branches", "Nationwide", "Main office", "", "02-5905992; 02-5905993", "Direct booker", "Multiple campuses and leadership programs create repeat potential.", "Offer a workshop combining local ecology, practical skills, and reflection.", "https://ein-prat.com", "https://ein-prat.com/partners/%D7%9E%D7%A9%D7%A8%D7%93-%D7%94%D7%97%D7%99%D7%A0%D7%95%D7%9A/", "Official website");
add("B", "Mechina / programs", "דרך ארץ – תוכניות אופק", "Youth and young-adult programs", "Negev / nationwide", "Nationwide", "Organization office", "office@derecheretz.org.il", "08-9760688", "Connector", "Runs several programs and can place workshops across cohorts.", "Ask for the educational-program manager and offer a pilot workshop.", "https://derecheretz.org.il", "https://derecheretz.org.il/%D7%A4%D7%A8%D7%98%D7%99%D7%9D-%D7%9C%D7%AA%D7%A9%D7%9C%D7%95%D7%9D/", "Official website");

// Student villages, student unions, and young communities
add("A", "Student villages / umbrella", "עמותת איילים", "Student villages", "Nationwide", "Nationwide", "Head office / community programming", "office@ayalim.org.il", "08-6550850", "Connector", "One contact can reach villages from Metula to Eilat.", "Ask for the staff member responsible for village culture and enrichment.", "https://www.ayalim.org.il/students", "https://www.ayalim.org.il/contact", "Official website");
add("A", "Student communities / umbrella", "תוצרת הארץ", "Student and young communities", "Nationwide", "Nationwide", "Head office", "office@tozeret.com", "055-5041316", "Connector", "Operates communities in Kiryat Shmona, Katzrin, Hatzor, Safed, Tiberias, Nof HaGalil and more.", "Offer a northern pilot, then ask to circulate it to community coordinators.", "https://www.tozerethaarez.org.il/students", "https://www.tozerethaarez.org.il/contact", "Official website");
add("A", "Student villages / umbrella", "כפרי הסטודנטים של בני עקיבא", "National student villages", "Nationwide", "Nationwide", "Yitzhak Friedman – director of student villages", "student@bna.org.il", "050-4401465", "Connector", "Direct national program director with access to many villages.", "Propose a trial workshop in one northern village and a group rate for others.", "https://bneiakiva.org.il/joining/join_students/", "https://bneiakiva.org.il/work-and-volunteering/bogrim/", "Official website");
add("A", "Student village", "כפר הסטודנטים בני עקיבא", "Kiryat Shmona", "Kiryat Shmona", "North", "Chen Weizman – village coordinator", "", "052-2716689", "Direct booker", "Weekly community activity makes a one-off or series easy to place.", "Offer a community evening with aromatherapy or herbal preparation.", "https://bneiakiva.org.il/joining/join_students/", "https://bneiakiva.org.il/joining/join_students/", "Official website");
add("A", "Student village", "כפר הסטודנטים בני עקיבא", "Karmiel", "Karmiel", "North", "Noga Hadad – village coordinator", "", "050-9799911", "Direct booker", "Local northern community with regular group meetings.", "Offer a hands-on herbal product evening for the whole village.", "https://bneiakiva.org.il/joining/join_students/", "https://bneiakiva.org.il/joining/join_students/", "Official website");
add("A", "Student village", "כפר הסטודנטים בני עקיבא", "Haspin", "Golan", "North", "Segev Gal-Or – village coordinator", "", "054-4549968", "Direct booker", "Rural Golan setting and a cohesive residential group.", "Lead with local plant identification and a seasonal field workshop.", "https://bneiakiva.org.il/joining/join_students/", "https://bneiakiva.org.il/joining/join_students/", "Official website");
add("A", "Student village", "כפר הסטודנטים בני עקיבא", "Acre", "Acre", "North", "Tamar Herbst – village coordinator", "", "058-7087171", "Direct booker", "Direct local coordinator and an established group format.", "Offer an on-site sensory workshop or a Galilee day trip.", "https://bneiakiva.org.il/joining/join_students/", "https://bneiakiva.org.il/joining/join_students/", "Official website");
add("A", "Student village", "כפר הסטודנטים בני עקיבא", "Haifa", "Haifa", "North", "Avia Bar – village coordinator", "", "050-7371615", "Direct booker", "Direct coordinator for a northern student community.", "Pitch a screen-free evening that ends with a take-home natural product.", "https://bneiakiva.org.il/joining/join_students/", "https://bneiakiva.org.il/joining/join_students/", "Official website");
add("A", "Student village", "כפר הסטודנטים בני עקיבא", "Beit Shean", "Beit Shean", "North", "Moria Wertman – village coordinator", "", "054-4502691", "Direct booker", "Direct local coordinator and a warm-climate valley setting.", "Offer seasonal tea, oils, or roots content adapted to the region.", "https://bneiakiva.org.il/joining/join_students/", "https://bneiakiva.org.il/joining/join_students/", "Official website");
add("Existing", "Student villages / umbrella", "קדמה", "Student villages", "Nationwide", "Nationwide", "Existing partner", "", "054-3215838", "Existing relationship", "Already a successful partner; useful as a referral and testimonial source.", "Ask for introductions to peer organizations and permission to quote a testimonial.", "https://kedma-hityashvut.org/students-villages/", "https://kedma-hityashvut.org/contact/", "Official website", "Existing relationship supplied by the user; do not treat as a cold lead.", "Existing partner", "Request warm introductions after confirming satisfaction.");
add("B", "Student organizations / umbrella", "התאחדות הסטודנטים והסטודנטיות הארצית", "National union", "Nationwide", "Nationwide", "Head office / community programs", "office@nuis.co.il", "02-9704425", "Connector", "Can route the offer to campus unions and student-community programs.", "Ask for the person responsible for culture, welfare, and campus communities.", "https://www.nuis.co.il", "https://www.nuis.co.il/wp-content/uploads/2023/06/%D7%A4%D7%A8%D7%95%D7%98%D7%95%D7%A7%D7%95%D7%9C-%D7%95%D7%A2%D7%93-%D7%9E%D7%A0%D7%94%D7%9C-17.1.pdf", "Official publication");
add("A", "Student union", "אגודת הסטודנטים תל-חי", "Campus culture and community", "Kiryat Shmona / Katzrin", "North", "Student union office", "agudaeast@gmail.com", "04-8181562", "Direct booker", "The union runs events, clubs, community evenings, and student welfare.", "Offer a campus workshop or an Upper Galilee field day.", "https://www.agudatelhai.co.il", "https://www.agudatelhai.co.il/", "Official website");
add("A", "Student union", "אס\"ט – אגודת הסטודנטים בטכניון", "Culture office", "Haifa", "North", "Culture office", "culture@asat.technion.ac.il", "04-6233426", "Direct booker", "Dedicated culture office produces workshops and events for a large student body.", "Pitch a practical midday or evening workshop on campus.", "https://www.asat.org.il", "https://www.asat.org.il/contents.php?id=structure", "Official website");
add("A", "Student union", "אגודת הסטודנטים אוניברסיטת חיפה", "Culture / welfare", "Haifa", "North", "Welfare office; ask to route to culture", "StudRevaha@univ.haifa.ac.il", "04-8288924", "Direct booker", "The union explicitly runs enrichment workshops and student welfare activities.", "Offer a low-barrier sensory session during the academic term.", "https://aguda.haifa.ac.il", "https://aguda.haifa.ac.il/%D7%9C%D7%95%D7%92%D7%99%D7%A1%D7%98%D7%99%D7%A7%D7%94-%D7%95%D7%A8%D7%95%D7%95%D7%97%D7%94/", "Official website");
add("A", "Student union", "אגודת הסטודנטים אורנים", "Campus life", "Kiryat Tivon", "North", "Union office", "michal_ka@oranim.ac.il", "04-9539612", "Direct booker", "Very close geographically and focused on student welfare and campus life.", "Offer a local, low-travel pilot workshop and repeat series.", "https://aguda-oranim.co.il", "https://aguda-oranim.co.il/", "Official website");
add("A", "Student union", "אגודת הסטודנטים גליל מערבי", "Campus culture", "Acre", "North", "Union office", "aguda@wgalil.ac.il", "04-9015113", "Direct booker", "The union organizes cultural projects and student activities.", "Offer an on-campus workshop with an optional take-home blend.", "https://www.wgalil.net", "https://www.wgalil.net/contact", "Official website");
add("A", "Student union", "אגודת הסטודנטים כנרת", "Campus culture and welfare", "Tzemach / Sea of Galilee", "North", "Union office", "office.aguda@mx.kinneret.ac.il", "04-6653607; 058-5351131", "Direct booker", "The union's formal mission includes cultural and welfare programming.", "Offer a lakeside seasonal plant and herbal preparation workshop.", "https://www.kinneret.ac.il", "https://www.guidestar.org.il/organization/580531929/contact", "Official nonprofit registry");

// Municipal and community programming
add("A", "Young-adult center", "מרכז צעירים יקנעם", "Young adults 18–40", "Yokneam", "North", "Gili Pe'er Kreiner – center director", "gili@bthere.org.il", "04-9591236", "Direct booker", "Local center runs community leadership and young-adult programming.", "Offer an evening workshop for young adults or reservists' families.", "https://forms.yoqneam.org.il/30-12-2018-%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8/", "https://forms.yoqneam.org.il/30-12-2018-%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8/", "Municipal website");
add("A", "Community center", "מתנ\"ס יקנעם", "Community programs", "Yokneam", "North", "Community-center office", "yokneam@matnasim.org.il", "04-9893986; 04-9890567", "Direct booker", "Programs children through older adults and regularly purchases courses and workshops.", "Send a three-option menu: families, adults, and older adults.", "https://mtns.org.il/centers/%D7%9E%D7%AA%D7%A0%D7%A1-%D7%99%D7%A7%D7%A0%D7%A2%D7%9D/", "https://mtns.org.il/centers/%D7%9E%D7%AA%D7%A0%D7%A1-%D7%99%D7%A7%D7%A0%D7%A2%D7%9D/", "Community-center network");
add("A", "Young-adult center", "מרכז צעירים עמק יזרעאל", "Young adults", "Jezreel Valley", "North", "Dikla Yochai Rotman", "diklayr@eyz.org.il", "04-6520009; 050-4318032", "Direct booker", "Regional center can reach many nearby communities and young adults.", "Offer a regional pilot and ask for introductions to local communities.", "https://www.eyz.org.il", "https://www.gov.il/BlobFolder/generalpage/documents/he/strip_topic_society_youthcenter1122.pdf", "Government directory", "Government directory published in 2022; confirm current role.");
add("B", "Young-adult center", "מרכז צעירים עפולה", "Young adults", "Afula", "North", "Yael Altman", "yaela@afula.muni.il", "04-6484280", "Direct booker", "Large regional city center with workshops and enrichment programming.", "Offer an accessible indoor herbal preparation evening.", "https://www.yca.co.il", "https://www.gov.il/BlobFolder/generalpage/documents/he/strip_topic_society_youthcenter1122.pdf", "Government directory", "Government directory published in 2022; confirm current role.");
add("B", "Young-adult center", "מרכז צעירים גלבוע", "Young adults", "Gilboa", "North", "Maya Yaakov", "maya@hagilboa.org.il", "052-6423224", "Direct booker", "Regional rural audience and community-development mandate.", "Offer a seasonal outdoor workshop for local young adults.", "https://www.hagilboa.org.il", "https://www.gov.il/BlobFolder/generalpage/documents/he/strip_topic_society_youthcenter1122.pdf", "Government directory", "Government directory published in 2022; confirm current role.");
add("B", "Young-adult center", "מרכז צעירים כפר כמא", "Young adults", "Kfar Kama", "North", "Arif Susha", "arifsusha@gmail.com", "054-4979150", "Direct booker", "Community center can adapt a workshop to a close local group.", "Lead with local plant traditions and a respectful, practical format.", "https://www.kfarkama.co.il", "https://www.gov.il/BlobFolder/generalpage/documents/he/strip_topic_society_youthcenter1122.pdf", "Government directory", "Government directory published in 2022; confirm current role.");
add("A", "Young-adult center", "המרכזית – מרכז צעירים קריית שמונה", "Young adults", "Kiryat Shmona", "North", "Center office", "rakezet.k8@gmail.com", "04-6036815", "Direct booker", "Direct northern community hub with culture, careers, and community activity.", "Offer a post-return community workshop focused on restoration and togetherness.", "https://www.k-8.co.il", "https://www.gov.il/BlobFolder/generalpage/documents/he/strip_topic_society_youthcenter1122.pdf", "Government directory", "Government directory published in 2022; confirm current email.");
add("A", "Young-adult center", "מרכז פרס לצעירים חצור הגלילית", "Young adults", "Hatzor HaGlilit", "North", "Liron Peretz", "lironper95@gmail.com", "04-6800119", "Direct booker", "Close to Oren's Upper Galilee base and able to program local groups.", "Offer a low-travel pilot workshop for local young adults and families.", "https://www.hatzorg.co.il", "https://www.gov.il/BlobFolder/generalpage/documents/he/strip_topic_society_youthcenter1122.pdf", "Government directory", "Government directory published in 2022; confirm current role.");
add("B", "Young-adult center", "מרכז צעירים מעלות תרשיחא", "Young adults", "Maalot-Tarshiha", "North", "Center office", "", "04-9573927 ext. 3", "Direct booker", "The center runs social involvement, leisure, and leadership workshops.", "Ask for the culture/community coordinator and send the workshop menu.", "https://www.matnas-mal-tar.org.il", "https://www.kolzchut.org.il/he/%D7%9E%D7%A8%D7%9B%D7%96_%D7%A6%D7%A2%D7%99%D7%A8%D7%99%D7%9D_%D7%9E%D7%A2%D7%9C%D7%95%D7%AA_%D7%AA%D7%A8%D7%A9%D7%99%D7%97%D7%90", "Public service directory");
add("A", "Young-adult center", "מרכז צעירים מטה אשר", "Regional young adults", "Western Galilee", "North", "Carmit Peleg – center director", "carmitp@mta.org.il", "04-9109026; 050-6952123", "Connector", "Regional center can connect Oren with many kibbutzim and communities.", "Ask for a regional pilot and circulation to local culture coordinators.", "https://www.mta.org.il", "https://www.mta.org.il/uploads/n/1621424543.9867.pdf", "Regional council publication", "Contact was published in a 2021 service guide; confirm current role.");
add("A", "Community / young adults", "מרכז צעירים גליל תחתון", "Young adults", "Lower Galilee", "North", "Nofar Noy Koren – center director", "", "050-3231024", "Connector", "Regional center can reach villages, students, and young families.", "Offer a regional workshop series tied to local seasons.", "https://www.glt.org.il/phonebook/", "https://www.glt.org.il/phonebook/", "Regional council directory");
add("A", "Older adults / municipality", "המחלקה לאזרחים ותיקים – גליל תחתון", "Older-adult programs", "Lower Galilee", "North", "Ravit Haklai-Mori – department director", "", "050-5405554", "Direct booker", "Regional department coordinates activities for older adults across multiple communities.", "Offer a seated sensory workshop with non-ingestible take-home options.", "https://www.glt.org.il/phonebook/", "https://www.glt.org.il/phonebook/", "Regional council directory");
add("A", "Older adults / umbrella", "מיל\"ב חיפה", "17 senior clubs", "Haifa", "North", "Main office", "", "04-8620437; 04-8622491", "Connector", "One office coordinates 17 clubs that regularly host lectures and workshops.", "Ask for the program buyer and offer one pilot for a club.", "https://www.milav.org.il", "https://www.haifa.muni.il/welfare-and-community/senior-citizens/senior-citizens-guide/leisure/", "Municipal website");

// Disability, rehabilitation, and inclusive groups
add("A", "Disability community", "כפר תקווה", "Residential community", "Kiryat Tivon", "North", "Rebecca / main office", "rebeccal@kfartikva.org.il", "04-9539721", "Direct booker", "Very close to Yokneam and built around rich community life for adults with disabilities.", "Offer a calm, sensory, accessible workshop with adapted tools and pacing.", "https://kfar-tikva.org.il", "https://www.jgive.com/new/he/cad/charity-organizations/1949", "Verified nonprofit profile");
add("A", "Disability community", "כישורית", "Residential community", "Western Galilee", "North", "Main office", "kishorit1@kishorit.co.il", "04-9085110", "Direct booker", "Community for adults with special needs; on-site group programming is a natural fit.", "Offer an adapted sensory session, avoiding medical claims and screening allergies.", "https://kishorit.org.il", "https://kishorit.org.il/contact-heb/", "Official website");
add("A", "Disability organization", "עמותת כוונים", "Programs and supported housing", "Haifa / Nahariya / Acre / North", "North", "Main office", "kivunim@kvn.org.il", "04-9917444", "Connector", "Runs multiple northern programs for young adults with disabilities.", "Ask for the leisure/program manager and propose an accessible pilot.", "https://www.kvn.org.il", "https://www.kvn.org.il/wp-content/uploads/2025/03/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA-%D7%90%D7%AA%D7%A8-%D7%A2%D7%9E%D7%95%D7%AA%D7%AA-%D7%9B%D7%95%D7%95%D7%A0%D7%99%D7%9D.pdf", "Official website");
add("A", "Children with illness / camp", "כפר נהר הירדן", "Camp and group programs", "Givat Avni", "North", "Events and conferences department", "", "04-6608967; 04-6608999", "Direct booker", "Purpose-built camp already hosts creative workshops for children with serious illnesses.", "Offer a carefully risk-screened sensory activity; coordinate with medical staff.", "https://jrv.org.il", "https://jrv.org.il/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8/", "Official website");
add("A", "Disability organization", "אלווין ישראל", "Haifa and North branch", "Haifa / North", "North", "Sharon Wasserman – northern branch", "sharone@israelelwyn.org.il", "04-8511812", "Connector", "Northern branch supports adults with disabilities and explicitly welcomes culture and leisure activities.", "Offer a workshop that can travel to employment and community settings.", "https://israelelwyn.org.il/he", "https://israelelwyn.org.il/he/support-employment/", "Official website");
add("A", "Mental-health rehabilitation", "אנוש כרמיאל", "Social, leisure, housing, employment", "Karmiel", "North", "Branch office", "info@enosh.org.il", "077-7928243", "Direct booker", "The branch provides social and leisure rehabilitation programming.", "Offer a gentle, choice-based sensory workshop with clear boundaries.", "https://www.enosh.org.il", "https://www.enosh.org.il/%D7%94%D7%9E%D7%A8%D7%9B%D7%96%D7%99%D7%9D-%D7%A9%D7%9C%D7%A0%D7%95/", "Official website");
add("A", "Mental-health rehabilitation", "אנוש חיפה", "Social, leisure, housing, employment", "Haifa", "North", "Branch office", "info@enosh.org.il", "04-6838501", "Direct booker", "Large branch with social and leisure services.", "Offer an indoor, low-pressure herbal making session.", "https://www.enosh.org.il", "https://www.enosh.org.il/%D7%94%D7%9E%D7%A8%D7%9B%D7%96%D7%99%D7%9D-%D7%A9%D7%9C%D7%A0%D7%95/", "Official website");
add("A", "Disability leisure / umbrella", "אקים ישראל – אזור צפון", "Leisure clubs across the north", "North region", "North", "Ora Haviv – northern area manager", "ora.h@akim.org.il", "050-6926655", "Connector", "Coordinates adult leisure clubs in Karmiel, Nahariya, Krayot, Afula, Migdal HaEmek and more.", "Offer one adapted pilot and a repeatable format for multiple clubs.", "https://akim.org.il", "https://akim.org.il/entertainment/", "Official website");
add("A", "Disability leisure", "אקים חיפה", "Culture and leisure", "Haifa", "North", "Main office", "", "04-8679352", "Direct booker", "Organization explicitly uses one-time activities and group leisure programs.", "Ask for the culture and leisure manager; propose an accessible trial.", "https://www.akim-haifa.org.il", "https://www.akim-haifa.org.il/%D7%A6%D7%A8%D7%95-%D7%A7%D7%A9%D7%A8", "Official website");
add("A", "Mental-health rehabilitation", "קהילת חירם", "Supported housing and social activities", "Kiryat Tivon / Harduf", "North", "Main office", "hiram@hiram.org.il", "04-9059215; 04-9059368", "Direct booker", "Nearby rehabilitation community already offers social evenings, groups, and workshops.", "Offer a quiet sensory workshop with optional participation and no health promises.", "https://hiram.org.il", "https://hiram.org.il/assisted-living/", "Official website");
add("B", "Physical disability residence", "בית קסלר", "Residential rehabilitation", "Kiryat Haim", "North", "Main residence; ask for activities coordinator", "", "077-5546005", "Direct booker", "Community residence for adults with physical disabilities and active leisure needs.", "Offer a seated, accessible workshop; confirm dexterity and scent sensitivities.", "", "https://www.chabadkh.org/templates/articlecco_cdo/aid/4558240/jewish/-.htm", "Community partner listing", "Phone is from a community partner page; verify the activities contact first.");
add("B", "Autism / umbrella", "אלו\"ט – חטיבת הקהילה", "Community programs", "Nationwide", "Nationwide", "Community division", "", "03-7238334", "Connector", "Can route an adapted workshop to community programs and northern services.", "Ask for the northern leisure/programming lead and accessibility requirements.", "https://alut.org.il", "https://alut.org.il/contact/", "Official website");
add("B", "Social groups / autism", "תוכנית רעים", "Kiryat Shmona group", "Kiryat Shmona", "North", "Local coordinator", "", "050-7468178", "Direct booker", "Structured social group for young people; a guided sensory activity may suit the group.", "Ask about age, sensory profile, and preferred group size before proposing content.", "https://www.reim-groups.org.il", "https://www.reim-groups.org.il/page.php?bc=&bmb=2021&ht=%D7%A4%D7%A8%D7%99%D7%A1%D7%94+%D7%90%D7%A8%D7%A6%D7%99%D7%AA&id=6802&type=page", "Official program directory");
add("A", "Youth at risk", "עלם", "Kiryat Shmona youth center", "Kiryat Shmona", "North", "Michal Elichai – center director", "michael.elichay@elem.org.il", "050-4800002", "Direct booker", "The center runs group activities and content workshops for youth.", "Offer a safe, practical making activity with clear structure and no ingestion.", "https://elem.org.il", "https://elem.org.il/%D7%A4%D7%A8%D7%95%D7%99%D7%A7%D7%98%D7%99%D7%9D/", "Official website");

// Older-adult residences in Haifa and the north
add("A", "Older adults / residence", "דור טבעון", "Protected housing", "Kiryat Tivon", "North", "Reception / culture coordinator", "", "04-9039000; *9052 ext. 2", "Direct booker", "Nearby residence has dedicated rooms for lectures, classes, and workshops.", "Offer a seated sensory workshop, herbal stories, and a take-home external-use product.", "https://www.navedor.co.il/%D7%93%D7%95%D7%A8-%D7%98%D7%91%D7%A2%D7%95%D7%9F/", "https://www.navedor.co.il/%D7%99%D7%A6%D7%99%D7%A8%D7%AA-%D7%A7%D7%A9%D7%A8/", "Official website");
add("A", "Older adults / residence", "דור כרמל", "Protected housing", "Haifa", "North", "Reception / culture coordinator", "", "04-8297297; *9052 ext. 1", "Direct booker", "Residence offers extensive culture, leisure, and workshop programming.", "Offer a seated sensory workshop and ask about dietary/medical restrictions.", "https://www.navedor.co.il", "https://www.navedor.co.il/%D7%99%D7%A6%D7%99%D7%A8%D7%AA-%D7%A7%D7%A9%D7%A8/", "Official website");
add("B", "Older adults / residence", "משען כרמל", "Protected housing", "Haifa", "North", "National call center; ask for culture manager", "", "*6570", "Direct booker", "Large residence in Haifa with organized cultural programming.", "Ask to be connected to the home's culture and activities coordinator.", "https://www.mishan.co.il", "https://www.mishan.co.il/contact/", "Official website");
add("A", "Older adults / residence", "בית אבות ספרדי", "Residential care", "Haifa", "North", "Activities / social-work team", "info@ba-sfaradi.co.il", "073-2504200", "Direct booker", "Direct email and established residence; group enrichment is a likely need.", "Offer a seated scent-and-touch workshop with safe external-use materials.", "", "https://www.haifa.muni.il/welfare-and-community/senior-citizens/senior-citizens-guide/nursing-home/", "Municipal directory");
add("A", "Older adults / residence", "בית דינה", "Residential care", "Haifa", "North", "Activities / social-work team", "beitdina1@gmail.com", "04-8323202", "Direct booker", "Direct public contact for a Haifa residence.", "Offer a 60–75 minute seated workshop adapted to mobility and cognition.", "", "https://www.haifa.muni.il/welfare-and-community/senior-citizens/senior-citizens-guide/nursing-home/", "Municipal directory");
add("A", "Older adults / residence", "בית יולס", "Residential care", "Haifa", "North", "Activities / social-work team", "joles@joles.co.il", "077-7374100", "Direct booker", "Direct email and phone for a residence that may book enrichment.", "Lead with sensory memory, familiar local plants, and a simple take-home item.", "https://joles.co.il", "https://www.haifa.muni.il/welfare-and-community/senior-citizens/senior-citizens-guide/nursing-home/", "Municipal directory");
add("B", "Older adults / residence", "בן יהודה", "Residential care", "Haifa", "North", "Activities / social-work team", "info.benyehuda.haifa@gmail.com", "04-8370024", "Direct booker", "Direct public contact for a Haifa residence.", "Offer an accessible indoor workshop and ask about participant support needs.", "", "https://www.haifa.muni.il/welfare-and-community/senior-citizens/senior-citizens-guide/nursing-home/", "Municipal directory");

// High-tech, workplaces, and ecosystem connectors
add("A", "Workplace connector", "מינהלת עירונית לקידום תעשייה ועסקים יקנעם", "Yokneam high-tech park", "Yokneam", "North", "Tal Shahar Zhabotinsky – project manager", "talj@yoqneam.org.il", "", "Connector", "Municipal body connects companies across the Yokneam high-tech park.", "Ask for introductions to HR/welfare managers and offer a local company pilot.", "https://www.yoqneam.org.il", "https://greenbook.co.il/card/1816/38093", "Municipal business directory");
add("A", "Innovation hub", "HiCenter", "Startup ecosystem", "Haifa", "North", "Office / community partnerships", "office@hicenter.co.il", "04-8622333", "Connector", "Can reach founders, startup teams, and ecosystem events in Haifa.", "Offer a founder/team reset workshop or ecosystem community event.", "https://hicenter.co.il", "https://hicenter.co.il/apply/?lang=he", "Official website");
add("A", "Innovation hub", "CivicLabs", "Built-environment innovation center", "Yokneam", "North", "Partnerships team", "contact@civic-labs.com", "050-6237888", "Connector", "Local innovation hub with companies and partnerships in Yokneam.", "Pitch a short team wellbeing workshop or community event.", "https://www.civic-labs.com", "https://www.civic-labs.com/", "Official website");
add("A", "Innovation hub", "GAIA Partners", "Innovation center", "Kiryat Shmona", "North", "Noam Yossef", "noam@gaiapartners.co.il", "", "Connector", "Connects entrepreneurs and companies in the Upper Galilee ecosystem.", "Offer an ecosystem workshop for founders and returning northern teams.", "https://www.gaiapartners.co.il", "https://innovationisrael.org.il/en/innovation-centers-data/", "Israel Innovation Authority directory");
add("A", "Innovation hub", "NorthMed", "MedTech innovation center", "Sakhnin", "North", "Center team", "northmed@northmed.tech", "050-4995150", "Connector", "Community and innovation hub that can convene startup and professional groups.", "Offer a team wellbeing workshop; avoid clinical claims and keep it experiential.", "https://northmed.tech", "https://www.linkedin.com/company/northmed-innovation-center", "Official organization profile");
add("A", "Tech ecosystem connector", "Nortech Platform", "Northern high-tech network", "Karmiel / North", "North", "Network team", "", "+972-54-5769399", "Connector", "Network maps more than 500 northern companies and can amplify the offer.", "Ask about listing Oren as a northern team-activity provider and partner events.", "https://nortech-platform.com", "https://nortech-platform.com/privacy-policy-2/", "Official website");
add("B", "Innovation hub", "Margalit Startup City Galil", "FoodTech and AgriTech center", "Kiryat Shmona", "North", "Events / space partnerships via contact form", "", "", "Connector", "Strong thematic overlap with plants, agriculture, food, and community.", "Pitch an event for founders or an ecosystem evening; use the event-planner form.", "https://margalitsc.com", "https://margalitsc.com/home-page/", "Official website");
add("A", "High-tech employer", "Medtronic Yokneam", "Given Imaging site", "Yokneam", "North", "Ziva Curzon – site contact", "ziva.curzon@medtronic.com", "04-9097777", "Direct employer", "Large local employer with a published site contact.", "Ask to be routed to People/HR or employee wellbeing for an on-site workshop.", "https://www.medtronic.com/il-he/our-company/Medtronic_Israel.html", "https://www.medtronic.com/il-he/our-company/Medtronic_Israel.html", "Official company website");
add("B", "High-tech employer", "Elbit Systems", "Yokneam / Haifa", "North", "Corporate HR", "corporate.hr@elbitsystems.com", "+972-77-2940000", "Direct employer", "Large northern employer; central HR can route to site welfare teams.", "Request the Yokneam or Haifa employee-experience/welfare contact.", "https://www.elbitsystems.com", "https://www.elbitsystems.com/contact-us", "Official company website");
add("B", "High-tech employer", "Tower Semiconductor", "World headquarters / fabs", "Migdal HaEmek", "North", "Main switchboard; ask for HR/welfare", "info@towersmi.com", "+972-4-6506611", "Direct employer", "Large northern workforce and central site in Migdal HaEmek.", "Ask for employee wellbeing, welfare committee, or People team.", "https://towersemi.com", "https://towersemi.com/contact/facilities/", "Official company website", "Email is from a published corporate overview; confirm current address by phone.");
add("B", "High-tech employer", "NVIDIA Israel", "Yokneam office", "Yokneam", "North", "Main office / Israel communications", "israel-pr@nvidia.com", "+972-74-7236511", "Direct employer", "Very large local employer; contact can route to site community or HR.", "Use the phone first and ask for Yokneam employee experience or welfare.", "https://www.nvidia.com", "https://nvidianews.nvidia.com/contacts/1000", "Official company contact page", "Published email is for Israel communications, not workshop booking; use only to request routing.");
add("B", "High-tech employer", "VIDIA", "Yokneam team", "Yokneam", "North", "General office", "info@vidia.ai", "+972-53-2860901", "Direct employer", "Smaller local AI company may make quicker team-activity decisions.", "Pitch a compact on-site team workshop with minimal logistics.", "https://www.vidia.ai", "https://www.vidia.ai/contact-us", "Official company website");

const workbook = Workbook.create();
const overview = workbook.worksheets.add("Overview");
const sheet = workbook.worksheets.add("Leads");

const font = "Arial";
overview.showGridLines = false;
sheet.showGridLines = false;
overview.tabColor = "#355E3B";
sheet.tabColor = "#6F8F72";

// Leads sheet
sheet.getRange("A2:U2").merge();
sheet.getRange("A2").values = [["Oren Herbalist workshop outreach database"]];
sheet.getRange("A2:U2").format = { font: { name: font, size: 15, bold: true, color: "#243328" }, verticalAlignment: "center" };
sheet.getRange("A3:U3").merge();
sheet.getRange("A3").values = [["Public organizational contacts researched for nationwide mechinot and student programs, plus broader northern group opportunities. Checked 29 Oct 2026. Roles and contact details can change—verify before outreach."]];
sheet.getRange("A3:U3").format = { font: { name: font, size: 10, italic: true, color: "#5E6B61" }, wrapText: true };
sheet.getRange("A4:U4").format.borders = { bottom: { style: "thin", color: "#9EAA9F" } };

const headers = [["Priority", "Category", "Organization", "Program / branch", "City / area", "Coverage", "Contact person / role", "Email", "Phone / WhatsApp", "Route", "Why it fits", "Best opening", "Website", "Source", "Source type", "Checked", "Verification note", "Outreach status", "Last contacted", "Next action", "Notes"]];
sheet.getRange("A6:U6").values = headers;
const endRow = 6 + leads.length;
sheet.getRange(`A7:U${endRow}`).values = leads;
const table = sheet.tables.add(`A6:U${endRow}`, true, "OutreachLeadsTable");
table.style = "TableStyleMedium4";
table.showBandedRows = true;
table.showFilterButton = true;

sheet.getRange(`A6:U${endRow}`).format.font = { name: font, size: 10, color: "#263229" };
sheet.getRange("A6:U6").format = { fill: "#355E3B", font: { name: font, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange(`A7:U${endRow}`).format.verticalAlignment = "top";
sheet.getRange(`A7:U${endRow}`).format.wrapText = true;
sheet.getRange(`A7:A${endRow}`).format.horizontalAlignment = "center";
sheet.getRange(`F7:F${endRow}`).format.horizontalAlignment = "center";
sheet.getRange(`J7:J${endRow}`).format.horizontalAlignment = "center";
sheet.getRange(`O7:P${endRow}`).format.horizontalAlignment = "center";
sheet.getRange(`R7:S${endRow}`).format.horizontalAlignment = "center";
sheet.getRange(`H7:I${endRow}`).format.numberFormat = "@";
sheet.getRange(`P7:P${endRow}`).format.numberFormat = "dd-mmm-yyyy";
sheet.getRange(`S7:S${endRow}`).format.numberFormat = "dd-mmm-yyyy";
sheet.getRange(`R7:U${endRow}`).format.fill = "#FFF7D6";
sheet.getRange(`R7:R${endRow}`).dataValidation = { rule: { type: "list", values: ["Not contacted", "Email sent", "Called", "Follow-up due", "Meeting booked", "Proposal sent", "Won", "Not a fit", "Existing partner"] } };
sheet.getRange(`A7:A${endRow}`).conditionalFormats.add("containsText", { text: "A", format: { fill: "#DCEEDC", font: { bold: true, color: "#214C28" } } });
sheet.getRange(`A7:A${endRow}`).conditionalFormats.add("containsText", { text: "B", format: { fill: "#E8EEF5", font: { bold: true, color: "#31526F" } } });
sheet.getRange(`A7:A${endRow}`).conditionalFormats.add("containsText", { text: "Existing", format: { fill: "#F1E4F4", font: { bold: true, color: "#6B3D73" } } });

const widths = [10, 25, 29, 24, 20, 13, 27, 30, 20, 17, 43, 40, 34, 46, 18, 14, 38, 17, 15, 32, 34];
for (let c = 0; c < widths.length; c++) sheet.getRangeByIndexes(5, c, endRow - 5, 1).format.columnWidth = widths[c];
sheet.getRange("A2:U2").format.rowHeight = 25;
sheet.getRange("A3:U3").format.rowHeight = 35;
sheet.getRange("A6:U6").format.rowHeight = 32;
sheet.getRange(`A7:U${endRow}`).format.rowHeight = 58;
sheet.freezePanes.freezeRows(6);
sheet.freezePanes.freezeColumns(3);

// Overview sheet
overview.getRange("A2:H2").merge();
overview.getRange("A2").values = [["Oren Herbalist outreach plan"]];
overview.getRange("A2:H2").format = { font: { name: font, size: 15, bold: true, color: "#243328" }, verticalAlignment: "center" };
overview.getRange("A3:H3").merge();
overview.getRange("A3").values = [["A practical starting list for workshops with organized groups. Start with Priority A northern direct bookers, then use umbrella organizations to multiply introductions nationwide."]];
overview.getRange("A3:H3").format = { font: { name: font, size: 10, italic: true, color: "#5E6B61" }, wrapText: true };
overview.getRange("A4:H4").format.borders = { bottom: { style: "thin", color: "#9EAA9F" } };

overview.getRange("A6:F6").values = [["Pipeline summary", "Value", "", "", "", ""]];
overview.getRange("A6:F6").format = { fill: "#355E3B", font: { name: font, size: 10, bold: true, color: "#FFFFFF" } };
overview.getRange("A7:B12").values = [
  ["Total organizations / branches", null],
  ["Priority A leads", null],
  ["Direct bookers", null],
  ["Connectors", null],
  ["Northern leads", null],
  ["Existing partners", null],
];
overview.getRange("B7").formulas = [[`=COUNTA(Leads!$C$7:$C$${endRow})`]];
overview.getRange("B8").formulas = [[`=COUNTIFS(Leads!$A$7:$A$${endRow},"A")`]];
overview.getRange("B9").formulas = [[`=COUNTIFS(Leads!$J$7:$J$${endRow},"Direct booker")`]];
overview.getRange("B10").formulas = [[`=COUNTIFS(Leads!$J$7:$J$${endRow},"Connector")`]];
overview.getRange("B11").formulas = [[`=COUNTIFS(Leads!$F$7:$F$${endRow},"North")`]];
overview.getRange("B12").formulas = [[`=COUNTIFS(Leads!$A$7:$A$${endRow},"Existing")`]];
overview.getRange("A7:B12").format.font = { name: font, size: 11 };
overview.getRange("B7:B12").format = { fill: "#EDF4ED", font: { name: font, size: 12, bold: true, color: "#214C28" }, horizontalAlignment: "center" };

overview.getRange("D6:F6").values = [["Priority meaning", "Use", ""]];
overview.getRange("D6:F6").format = { fill: "#355E3B", font: { name: font, size: 10, bold: true, color: "#FFFFFF" } };
overview.getRange("D7:E10").values = [
  ["A", "Strong fit, northern/direct contact, or high-leverage connector"],
  ["B", "Good fit but farther away, less direct, or needs routing"],
  ["C", "Exploratory contact"],
  ["Existing", "Warm relationship; ask for referrals/testimonial"],
];
overview.getRange("D7:E10").format.font = { name: font, size: 10 };
overview.getRange("D7:D10").format.font = { name: font, size: 10, bold: true };

overview.getRange("A15:C15").values = [["Category", "Lead count", "Recommended first ask"]];
overview.getRange("A15:C15").format = { fill: "#6F8F72", font: { name: font, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
const categories = [
  ["Mechina", "Offer one pilot cohort workshop"],
  ["Student villages", "Ask for village-culture coordinator"],
  ["Student union", "Send to culture/welfare office"],
  ["Young-adult center", "Propose a public evening workshop"],
  ["Disability", "Ask about access, scent, dexterity, and support needs"],
  ["Older adults", "Propose a seated sensory format"],
  ["High-tech / workplace", "Ask for HR, People, welfare, or employee experience"],
];
overview.getRange("A16:C22").values = categories.map(([name, ask]) => [name, null, ask]);
const categoryGroups = [
  ["Mechina", "Mechina / programs", "Mechina / umbrella"],
  ["Student village", "Student villages / umbrella"],
  ["Student union"],
  ["Young-adult center"],
  ["Autism / umbrella", "Children with illness / camp", "Disability community", "Disability leisure", "Disability leisure / umbrella", "Disability organization", "Mental-health rehabilitation", "Physical disability residence", "Social groups / autism"],
  ["Older adults / municipality", "Older adults / residence", "Older adults / umbrella"],
  ["High-tech employer", "Innovation hub", "Tech ecosystem connector", "Workplace connector"],
];
for (let i = 0; i < categoryGroups.length; i++) {
  const formula = categoryGroups[i]
    .map((category) => `COUNTIF(Leads!$B$7:$B$${endRow},"${category}")`)
    .join("+");
  overview.getRange(`B${16 + i}`).formulas = [[`=${formula}`]];
}
overview.getRange("A16:C22").format.font = { name: font, size: 10 };
overview.getRange("B16:B22").format.horizontalAlignment = "center";

overview.getRange("E15:H15").values = [["Recommended first wave", "Why", "Route", "Next step"]];
overview.getRange("E15:H15").format = { fill: "#6F8F72", font: { name: font, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
overview.getRange("E16:H27").values = [
  ["מכינת גליל עליון", "Several cohorts close to Oren", "Direct", "Call, then email one-page menu"],
  ["מדרשת תבור", "Multiple northern branches", "Direct", "Ask for educational-program lead"],
  ["מכינת חנתון", "Inclusive and experiential", "Direct", "Offer adapted pilot"],
  ["איילים", "National multiplier", "Connector", "Ask to reach village coordinators"],
  ["תוצרת הארץ", "Many northern communities", "Connector", "Offer a northern pilot"],
  ["בני עקיבא – כפרי סטודנטים", "National director is public", "Connector", "Pilot in Kiryat Shmona or Karmiel"],
  ["מתנ\"ס יקנעם", "Local and broad age range", "Direct", "Send three-format menu"],
  ["כפר תקווה", "Very local and strong community fit", "Direct", "Ask about access needs"],
  ["אקים צפון", "One contact reaches many clubs", "Connector", "Propose adapted repeatable format"],
  ["מיל\"ב חיפה", "17 senior clubs", "Connector", "Pilot at one club"],
  ["מינהלת העסקים יקנעם", "Access to local employers", "Connector", "Request HR introductions"],
  ["Medtronic Yokneam", "Large nearby employer", "Direct employer", "Ask for People/welfare"],
];
overview.getRange("E16:H27").format.font = { name: font, size: 10 };
overview.getRange("A30:H30").merge();
overview.getRange("A30").values = [["Suggested positioning by audience"]];
overview.getRange("A30:H30").format = { fill: "#355E3B", font: { name: font, size: 10, bold: true, color: "#FFFFFF" } };
overview.getRange("A31:H35").values = [
  ["Mechinot and student groups", "Experiential nature learning, group connection, local plants, practical skills, and a product to take home.", "", "", "", "", "", ""],
  ["Community centers and families", "Choose by age: kids' sensory making, adult herbal preparation, or an outdoor seasonal walk.", "", "", "", "", "", ""],
  ["Disability and rehabilitation groups", "Accessible sensory format, predictable structure, optional participation, adapted tools, and advance screening for allergies and scent sensitivity.", "", "", "", "", "", ""],
  ["Older adults", "Seated scent-and-touch experience using familiar local plants. Coordinate medication, ingestion, allergy, mobility, and cognitive needs with staff.", "", "", "", "", "", ""],
  ["Workplaces and high-tech", "A screen-free team reset: smell, touch, simple making, and relaxed conversation. Ask for HR, People, welfare, or employee experience.", "", "", "", "", "", ""],
];
overview.getRange("A31:H35").format = { font: { name: font, size: 10 }, wrapText: true, verticalAlignment: "top" };
overview.getRange("A31:A35").format.font = { name: font, size: 10, bold: true, color: "#214C28" };
for (let row = 31; row <= 35; row++) overview.getRange(`B${row}:H${row}`).merge();

overview.getRange("A2:H35").format.verticalAlignment = "center";
overview.getRange("A3:H3").format.rowHeight = 34;
overview.getRange("A31:H35").format.rowHeight = 42;
overview.getRange("A1:A35").format.columnWidth = 26;
overview.getRange("B1:B35").format.columnWidth = 14;
overview.getRange("C1:C35").format.columnWidth = 48;
overview.getRange("D1:D35").format.columnWidth = 14;
overview.getRange("E1:E35").format.columnWidth = 31;
overview.getRange("F1:F35").format.columnWidth = 38;
overview.getRange("G1:G35").format.columnWidth = 17;
overview.getRange("H1:H35").format.columnWidth = 32;
overview.freezePanes.freezeRows(4);

workbook.recalculate();

const overviewCheck = await workbook.inspect({ kind: "table", range: "Overview!A1:H35", include: "values,formulas", tableMaxRows: 35, tableMaxCols: 8, maxChars: 12000 });
console.log(overviewCheck.ndjson);
const leadsCheck = await workbook.inspect({ kind: "table", range: `Leads!A1:U12`, include: "values,formulas", tableMaxRows: 12, tableMaxCols: 21, maxChars: 12000 });
console.log(leadsCheck.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" });
console.log(errors.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const overviewPreview = await workbook.render({ sheetName: "Overview", range: "A1:H35", scale: 1.3, format: "png" });
await fs.writeFile(`${outputDir}/overview_preview.png`, new Uint8Array(await overviewPreview.arrayBuffer()));
const leadsPreview = await workbook.render({ sheetName: "Leads", range: "A1:K18", scale: 1.1, format: "png" });
await fs.writeFile(`${outputDir}/leads_preview.png`, new Uint8Array(await leadsPreview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(JSON.stringify({ outputPath, leadCount: leads.length, endRow }));
