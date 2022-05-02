import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { GtmContext } from '@commercetools-frontend/application-shell';
import useTracking from './use-tracking';

describe('useTracking', () => {
  it('provides GmtContext methods (track and getHierarchy)', async () => {
    const gmtTrack = jest.fn();
    const gmtGetHierarchy = jest.fn(() => 'fake-hierarchy');

    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <GtmContext.Provider
        value={{ track: gmtTrack, getHierarchy: gmtGetHierarchy }}
      >
        {children}
      </GtmContext.Provider>
    );

    const { result } = renderHook(useTracking, { wrapper });
    result.current.track('fake-event', 'fake-category', 'fake-label');

    expect(gmtTrack).toHaveBeenCalledWith(
      'fake-event',
      'fake-category',
      'fake-label'
    );
    expect(result.current.getHierarchy()).toBe('fake-hierarchy');
  });
});
