import { View } from 'react-native';
import React from 'react';
import Course from '../components/Course';
import { TouchableOpacity } from 'react-native-gesture-handler';
import courses from '../components/allCourses';

const MobileDevelopment = ({ navigation }) => {
  return (
    <View>
      {courses.map((course, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            navigation.navigate('CourseInfo', {
              courseImage: course.image,
              courseTitle: course.title,
              courseDescription: course.description,
              courseLearn: course.whatyoulearn,
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
