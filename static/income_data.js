var lower_break = [0, 10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 500, 1000];
var upper_break = [10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 500, 1000, 2000];
var number_of_units = [24457, 28266, 20763, 17188, 13691, 19752, 13684, 11232, 7090, 2144, 3222, 907, 433];
var x_ticks_location = [0, 50, 150, 250, 500, 750, 1000, 2000];
var x_ticks_print = ["0", "50k", "150k", "250k", "500k", "750k", "1mn", "2mn"];


// add extra breaks for the upper income strata

var percentiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 99.5, 99.9];


// these are the lower breaks for each percentile, broken down by tax unit

var all_tax_units = [0, 2451, 4134, 5184, 6028, 6922, 7626, 8226, 8764, 9235, 9832, 10482, 11366, 12207, 12999, 13732, 14447, 15064, 15736, 16358, 16992, 17659, 18204, 18768, 19375, 19964, 20860, 22013, 23034, 23873, 24675, 25505, 26311, 27033, 27811, 28560, 29306, 29999, 30999, 32188, 33281, 34272, 35295, 36253, 37194, 38051, 39064, 39953, 41113, 42327, 43564, 44769, 45871, 46956, 48095, 49225, 50353, 51922, 54282, 57213, 59670, 61654, 63469, 65192, 66639, 68140, 69658, 71150, 72539, 73866, 75296, 77160, 79838, 83011, 85811, 88317, 90794, 93165, 95174, 97298, 99424, 102060, 106770, 117025, 125260, 131032, 136231, 141453, 147725, 154131, 160864, 168227, 177123, 187412, 200026, 235687, 290860, 360435, 506553, 815868, 2070574];

var single = [0, 0, 0, 963, 2073, 3013, 3704, 4245, 4608, 5068, 5516, 5763, 6158, 6578, 6911, 7218, 7530, 7902, 8063, 8294, 8556, 8804, 8997, 9284, 9582, 9872, 10163, 10438, 10878, 11338, 11777, 12154, 12577, 12967, 13410, 13699, 14096, 14503, 14872, 15188, 15570, 15967, 16382, 16652, 17119, 17562, 17978, 18283, 18676, 19092, 19526, 19883, 20510, 21283, 22004, 22704, 23310, 23858, 24506, 25102, 25836, 26463, 27106, 27732, 28328, 28907, 29548, 30225, 31137, 32245, 33137, 34037, 34918, 35809, 36640, 37585, 38397, 39326, 40504, 41840, 43478, 44953, 46274, 47653, 48838, 50301, 52888, 58072, 61815, 64858, 67187, 70133, 73418, 77833, 87149, 95378, 109210, 143705, 193307, 309288, 756207];

var filing_jointly = [4938, 8687, 11462, 13927, 15745, 17291, 18543, 19907, 21978, 23748, 25354, 26823, 28134, 29386, 30711, 32350, 33814, 35152, 36434, 37621, 38670, 39795, 40944, 42158, 43367, 44474, 45563, 46551, 47640, 48695, 49620, 50776, 52117, 54028, 56339, 58429, 60094, 61521, 62868, 64228, 65469, 66515, 67567, 68676, 69850, 70839, 71843, 72738, 73626, 74608, 75563, 76785, 78336, 80150, 82237, 84161, 85854, 87417, 88986, 90474, 92061, 93304, 94539, 95835, 96993, 98227, 99491, 101059, 102865, 105552, 110508, 117689, 122702, 126471, 129936, 132961, 135858, 138689, 141739, 145455, 148951, 152794, 156338, 160290, 163958, 168682, 173535, 178804, 184509, 191126, 198101, 208408, 237498, 269114, 298736, 336706, 391010, 477128, 761938];

var head_of_household = [1939, 3681, 4678, 5551, 6156, 6910, 7360, 7802, 8323, 8614, 8839, 9195, 9535, 9892, 10289, 10799, 11375, 11900, 12440, 12935, 13374, 13800, 14258, 14745, 15171, 15536, 15883, 16197, 16516, 16943, 17280, 17696, 17986, 18228, 18588, 18904, 19220, 19569, 19883, 20245, 20782, 21409, 22168, 22759, 23376, 23861, 24277, 24697, 25135, 25583, 25943, 26311, 26654, 27015, 27477, 27871, 28279, 28730, 29160, 29562, 29919, 30372, 30996, 31719, 32555, 33292, 33952, 34651, 35293, 35987, 36590, 37272, 37924, 38701, 39395, 40014, 40964, 41979, 43103, 44204, 45080, 46270, 47318, 48455, 49747, 50992, 53593, 56473, 60064, 63274, 66144, 68565, 70985, 73597, 77703, 85138, 94033, 104924, 151849, 193623, 499298];


source = "Source: Urban-Brookings Tax Policy Center Table T11-0191, Distribution of Federal Payroll and Income Taxes by Cash Income Level, 2011";

// total number of individuals and tax units in each bucket of tax units (by type)

var total_people = [312.7, 82.6, 166.7, 60.1];

var tax_units = [160.4, 77.6, 56.1, 24.3];