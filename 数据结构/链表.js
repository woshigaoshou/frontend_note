function LinkList() {
  // 首部指针
  this.head = null;
  this.length = 0;
  // 定义内部节点类
  function Node(element) {
    this.element = element;
    this.next = null;
  }
  // 向链表末尾添加元素
  LinkList.prototype.append = function(element) {
    const node = new Node(element);
    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;
      while(current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.length++;
  }
  // 插入指定位置
  LinkList.prototype.insert = function(position, element) {
    const node = new Node(element);
    let current = this.head;
    let pre = null;
    let index = 0;
    if (position < 0 || position > this.length) {
      throw new Error('error');
    } else if (position === 0) {
      this.head = node;
      node.next = current;
    } else {
      while(index++ < position) {
        pre = current;
        current = current.next;
      }
      pre.next = node;
      node.next = current;
    }
    this.length++;
  }
  // 获取指定位置元素
  LinkList.prototype.get = function(position) {
    let current = this.head;
    let index = 0;
    if (position < 0 || position > this.length) {
      throw new Error('position error');
    }
    while(index < position) {
      current = current.next;
      index++;
    }
    return current.element;
  }
  // 获取指定元素索引
  LinkList.prototype.indexOf = function(element) {
    let current = this.head;
    let index = 0;
    while(current) {
      if (element === current.element) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
  }
  // 更新指定位置元素
  LinkList.prototype.update = function(position, element) {
    let current = this.head;
    let index = 0;
    if (position < 0 || position > this.length) {
      throw new Error('error');
    } 
    while(index++ < position) {
      current = current.next;
    }
    current.element = element;
    return true;
  }
  // 移除指定位置的元素
  LinkList.prototype.removeAt = function(position) {
    let current = this.head;
    let pre = null;
    let index = 0;
    if (position < 0 || position > this.length) {
      throw new Error('error');
    }
    if (position === 0) {
      this.head = this.head.next;
      return true;
    }
    while(index++ < position) {
      pre = current;
      current = current.next;
    }
    pre.next = current.next;
    this.length--;
    return current.element;
  }
  // 移除元素
  LinkList.prototype.remove = function(element) {
    let position = this.indexOf(element);
    return this.removeAt(position);
  }
  LinkList.prototype.isEmpty = function() {
    return this.length === 0;
  }
  LinkList.prototype.size = function() {
    return this.length;
  }
  LinkList.prototype.toString = function() {
    let current = this.head;
    let result = '';
    if (this.head === null) return '';
    while(current) {
      result += result === '' ? current.element : ` ${current.element}`;
      current = current.next;
    }
    return result;
  }
}
let linklist = new LinkList();
linklist.append(2);
linklist.append(42);
linklist.append(23);
linklist.append(122);
linklist.append(251);
linklist.insert(5, 999)
// linklist.toString();
linklist.get(4);
linklist.update(4, 9999);
linklist.get(4);
linklist.toString();
linklist.removeAt(4);
linklist.toString();


