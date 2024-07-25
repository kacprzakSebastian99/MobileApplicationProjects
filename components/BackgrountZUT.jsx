import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BackgroundTriangles = () => {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg style={{ position: 'absolute', top: 0, left: 0, width: wp('100%'), height: hp('100%') }}>
        <Polygon points={`0,${hp('0%')} ${wp('95%')},${hp('0%')} 0,${hp('92%')} 0,${hp('100%')}`} fill="#0C7E43"/>
        <Polygon points={`${wp('100%')},${hp('100%')} ${wp('100%')},0 ${wp('-3%')},${hp('100%')} ${wp('0%')},${hp('100%')}`} fill="#1D2E96"/>
      </Svg>
    </View>
  );
};

export default BackgroundTriangles;
