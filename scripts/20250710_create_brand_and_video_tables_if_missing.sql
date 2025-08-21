-- Creates youtube_videos & brand_images only if they do NOT exist.
-- Safe to run repeatedly.

create table if not exists youtube_videos (
  id            serial primary key,
  title         varchar(500) not null,
  video_url     text         not null,
  thumbnail_url text,
  is_main_video boolean      default false,
  display_order integer      default 0,
  is_active     boolean      default true,
  created_at    timestamp    default current_timestamp
);

create table if not exists brand_images (
  id            serial primary key,
  title         varchar(255) not null,
  image_url     text         not null,
  display_order integer      default 0,
  is_active     boolean      default true,
  created_at    timestamp    default current_timestamp
);

-- Populate with 3 demo rows each (insert-on-conflict-do-nothing)
insert into youtube_videos (id,title,video_url,thumbnail_url,is_main_video,display_order)
values
  (1,'Demo Main Video','https://www.youtube.com/embed/dQw4w9WgXcQ','https://picsum.photos/780/439?random=999',true,1),
  (2,'Demo Video #2','https://www.youtube.com/embed/abc123','https://picsum.photos/110/90?random=998',false,2),
  (3,'Demo Video #3','https://www.youtube.com/embed/ghi789','https://picsum.photos/110/90?random=997',false,3)
on conflict (id) do nothing;

insert into brand_images (id,title,image_url,display_order)
values
  (1,'Demo Brand A','https://picsum.photos/376/150?random=901',1),
  (2,'Demo Brand B','https://picsum.photos/376/150?random=902',2),
  (3,'Demo Brand C','https://picsum.photos/376/150?random=903',3)
on conflict (id) do nothing;
