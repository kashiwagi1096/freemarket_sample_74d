//= require jquery
//= require jquery_ujs
$(function(){
  // カテゴリーセレクトボックスのオプションを作成
  function appendOption(category){
    var html = `<option value="${category.name}" data-category="${category.id}">${category.name}</option>`;
    return html;
  }
  function appendChidrenBox(insertHTML){
    var childSelectHtml = '';
    childSelectHtml = `<div class='listing-select-wrapper__added' id= 'children_wrapper'>
                        <div class='listing-select-wrapper__box'>
                          <select class="listing-select-wrapper__box--select" id="child_category" name="category_id">
                            <option value="---" data-category="---">---</option>
                            ${insertHTML}
                          <select>
                        </div>
                      </div>`;
    $('#form').append(childSelectHtml);
  }
  // 孫カテゴリーの表示作成
  function appendGrandchidrenBox(insertHTML){
    var grandchildSelectHtml = '';
    grandchildSelectHtml = `<div class='listing-select-wrapper__added' id= 'grandchildren_wrapper'>
                              <div class='listing-select-wrapper__box'>
                                <select class="listing-select-wrapper__box--select" id="grandchild_category" name="category_id">
                                  <option value="---" data-category="---">---</option>
                                  ${insertHTML}
                                </select>
                              </div>
                            </div>`;
    $('#form2').append(grandchildSelectHtml);
  }
  // 親カテゴリー選択後のイベント
  $('#parent_category').on('change', function(){
    //選択された親カテゴリーの名前を取得
    var parentCategory = document.getElementById('parent_category').value;
    //親カテゴリーが初期値でないことを確認
    if (parentCategory != "選択して下さい"){
      $.ajax({
        url: 'get_category_children',
        type: 'GET',
        data: { parent_name: parentCategory },
        dataType: 'json'
      })
      .done(function(children){
        //親が変更された時、子以下を削除するする
        $('#children_wrapper').remove();
        $('#grandchildren_wrapper').remove();
        $('#size_wrapper').remove();
        $('#brand_wrapper').remove();
        var insertHTML = '';
        children.forEach(function(child){
          insertHTML += appendOption(child);
        });
        appendChidrenBox(insertHTML);
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      //親カテゴリーが初期値になった時、子以下を削除するする
      $('#children_wrapper').remove();
      $('#grandchildren_wrapper').remove();
      $('#size_wrapper').remove();
      $('#brand_wrapper').remove();
    }
  });
  // 子カテゴリー選択後のイベント
  $('#children_wrapper').on('change', '#child_category', function(){
    //選択された子カテゴリーのidを取得
    var childId = $('#child_category option:selected').data('category');
    //子カテゴリーが初期値でないことを確認
    if (childId != "---"){
      $.ajax({
        url: 'get_category_grandchildren',
        type: 'GET',
        data: { child_id: childId },
        dataType: 'json'
      })
      .done(function(grandchildren){
        if (grandchildren.length != 0) {
          //子が変更された時、孫以下を削除するする
          $('#grandchildren_wrapper').remove();
          // $('#size_wrapper').remove();
          // $('#brand_wrapper').remove();
          var insertHTML = '';
          grandchildren.forEach(function(grandchild){
            insertHTML += appendOption(grandchild);
          });
          appendGrandchidrenBox(insertHTML);
        }
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      //子カテゴリーが初期値になった時、孫以下を削除する
      $('#grandchildren_wrapper').remove();
      // $('#size_wrapper').remove();
      // $('#brand_wrapper').remove();
    }
  });
});