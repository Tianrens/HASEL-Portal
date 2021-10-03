import React from 'react';
import renderer from 'react-test-renderer';
import StylesProvider from '@mui/styles/StylesProvider';
import HeroPageTemplate from '../components/templates/HeroPageTemplate/HeroPageTemplate';

test('HeroPageTemplate renders properly', () => {
    const snapshotComponent = renderer.create(
        <StylesProvider injectFirst>
            <HeroPageTemplate />
        </StylesProvider>,
    );
    const tree = snapshotComponent.toJSON();
    expect(tree).toMatchSnapshot();
});
