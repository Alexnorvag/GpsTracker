import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  listContainer: {
    // paddingTop: 20,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 11,
  },
  listItemControls: {
    flexDirection: 'column',
    paddingHorizontal: 7
  },
});
