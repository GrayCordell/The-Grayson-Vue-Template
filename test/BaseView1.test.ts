import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseView1 from '../src/views/BaseView1.vue'


describe('baseView1.vue', () => {
  it('renders the welcome message', () => {
    const wrapper = mount(BaseView1)
    // Check that the title "Welcome to the App!" is rendered
    expect(wrapper.text()).toContain('Welcome to the App!')
  })
})
