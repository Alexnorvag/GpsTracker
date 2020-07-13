import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  listContainer: {
    paddingTop: 20,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    // backgroundColor: 'gray',
  },
  listButton: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFF',
  },
  listControls: {
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingLeft: 10,
  },
});
