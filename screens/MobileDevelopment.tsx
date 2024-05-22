import { View } from 'react-native';
import React from 'react';
import Course from '../components/Course';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {MobileCourses} from '../components/allCourses';

const MobileDevelopment = ({ navigation }) => {
  return (
    <View>
      {MobileCourses.map((course, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            navigation.navigate('CourseInfo', {
              courseImage: course.image,
              courseTitle: course.title,
              courseDescription: course.description,
              courseLearn: course.whatyoulearn,
              courseId : course.Id,
            })
          }
        >   
          <Course
            image={course.image}
            title={course.title}
            description={course.description}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MobileDevelopment;
