require "application_system_test_case"

class TableTest < ApplicationSystemTestCase
  setup do
    visit edit_post_path(posts(:empty))
    wait_for_editor
  end

  test "tables render with action text" do
    find_editor.toggle_command("insertTable")
    find_editor.send "Hello"
    click_on "Update Post"

    assert_no_selector "lexxy-editor"
    assert_table_structure(3, 3)
  end

  test "table style survives save, render and re-edit" do
    visit edit_post_path(posts(:empty), table_styles: true)
    wait_for_editor

    find_editor.toggle_command("insertTable")
    find_editor.send "Hello"
    find("lexxy-table-tools .lexxy-table-control--style [data-dropdown-trigger]").click
    click_table_handler_button "No borders"
    click_on "Update Post"

    assert_no_selector "lexxy-editor"
    assert_selector "table.lexxy-content__table--borderless"

    click_on "Edit this post"
    wait_for_editor
    assert_selector "lexxy-editor table.lexxy-content__table--borderless"
  end
end
